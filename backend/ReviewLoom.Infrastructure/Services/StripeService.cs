using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.BillingPortal;
using Stripe.Checkout;
using ReviewLoom.Application.Services;
using ReviewLoom.Domain.Interfaces;
using DomainSubscription = ReviewLoom.Domain.Entities.Subscription;
using StripeSubscription = Stripe.Subscription;
using BillingPortalSessionService = Stripe.BillingPortal.SessionService;
using CheckoutSessionService = Stripe.Checkout.SessionService;

namespace ReviewLoom.Infrastructure.Services;

public class StripeService : IStripeService
{
    private readonly IConfiguration _configuration;
    private readonly IUnitOfWork _unitOfWork;
    private readonly string _webhookSecret;

    public StripeService(IConfiguration configuration, IUnitOfWork unitOfWork)
    {
        _configuration = configuration;
        _unitOfWork = unitOfWork;
        _webhookSecret = _configuration["Stripe:WebhookSecret"] ?? string.Empty;
        StripeConfiguration.ApiKey = _configuration["Stripe:ApiKey"];
    }

    public async Task<string> CreateCheckoutSessionAsync(string userId, string planId, string successUrl, string cancelUrl)
    {
        var normalizedPlanId = NormalizePlanId(planId);
        var priceId = GetPriceId(normalizedPlanId);
        if (string.IsNullOrWhiteSpace(priceId))
        {
            throw new InvalidOperationException($"Stripe price is not configured for plan '{planId}'.");
        }

        var options = new Stripe.Checkout.SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new()
                {
                    Price = priceId,
                    Quantity = 1
                }
            },
            Mode = "subscription",
            SuccessUrl = successUrl,
            CancelUrl = cancelUrl,
            ClientReferenceId = userId,
            Metadata = new Dictionary<string, string>
            {
                ["user_id"] = userId,
                ["plan_id"] = normalizedPlanId
            },
            SubscriptionData = new SessionSubscriptionDataOptions
            {
                Metadata = new Dictionary<string, string>
                {
                    ["user_id"] = userId,
                    ["plan_id"] = normalizedPlanId
                }
            }
        };

        var service = new CheckoutSessionService();
        var session = await service.CreateAsync(options);
        return session.Url;
    }

    public async Task<string> CreateBillingPortalSessionAsync(Guid userId, string returnUrl)
    {
        var subscriptions = await _unitOfWork.Subscriptions.GetByUserIdAsync(userId);
        var activeSubscription = subscriptions.FirstOrDefault(s =>
            (s.Status == "active" || s.Status == "trialing" || s.Status == "past_due") &&
            !string.IsNullOrWhiteSpace(s.ProviderCustomerId));

        if (activeSubscription == null)
        {
            throw new InvalidOperationException("No Stripe subscription is available to manage.");
        }

        var options = new Stripe.BillingPortal.SessionCreateOptions
        {
            Customer = activeSubscription.ProviderCustomerId,
            ReturnUrl = returnUrl
        };

        var service = new BillingPortalSessionService();
        var session = await service.CreateAsync(options);
        return session.Url;
    }

    public async Task HandleWebhookAsync(string json, string signature)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(_webhookSecret))
            {
                throw new InvalidOperationException("Stripe webhook secret is not configured.");
            }

            var stripeEvent = EventUtility.ConstructEvent(json, signature, _webhookSecret);

            switch (stripeEvent.Type)
            {
                case EventTypes.CheckoutSessionCompleted:
                    if (stripeEvent.Data.Object is Stripe.Checkout.Session session)
                    {
                        await HandleCheckoutSessionCompletedAsync(session);
                    }
                    break;
                case EventTypes.CustomerSubscriptionUpdated:
                    if (stripeEvent.Data.Object is StripeSubscription updatedSubscription)
                    {
                        await UpsertSubscriptionAsync(updatedSubscription);
                    }
                    break;
                case EventTypes.InvoicePaymentSucceeded:
                    if (stripeEvent.Data.Object is Invoice invoice)
                    {
                        await HandleInvoicePaymentSucceededAsync(invoice);
                    }
                    break;
                case EventTypes.CustomerSubscriptionDeleted:
                    if (stripeEvent.Data.Object is StripeSubscription deletedSubscription)
                    {
                        await MarkSubscriptionCanceledAsync(deletedSubscription);
                    }
                    break;
            }
        }
        catch (StripeException e)
        {
            throw new Exception("Webhook error", e);
        }
    }

    private async Task HandleCheckoutSessionCompletedAsync(Stripe.Checkout.Session session)
    {
        if (!Guid.TryParse(session.ClientReferenceId, out var userId) || string.IsNullOrWhiteSpace(session.SubscriptionId))
        {
            return;
        }

        var service = new SubscriptionService();
        var stripeSubscription = await service.GetAsync(session.SubscriptionId);
        await UpsertSubscriptionAsync(stripeSubscription, userId, session.CustomerId);
    }

    private async Task HandleInvoicePaymentSucceededAsync(Invoice invoice)
    {
        var subscriptionId = invoice.Parent?.SubscriptionDetails?.SubscriptionId;
        if (string.IsNullOrWhiteSpace(subscriptionId))
        {
            return;
        }

        var service = new SubscriptionService();
        var stripeSubscription = await service.GetAsync(subscriptionId);
        await UpsertSubscriptionAsync(stripeSubscription);
    }

    private async Task MarkSubscriptionCanceledAsync(StripeSubscription stripeSubscription)
    {
        var subscription = await _unitOfWork.Subscriptions.GetByProviderSubscriptionIdAsync(stripeSubscription.Id);
        if (subscription == null)
        {
            return;
        }

        subscription.Status = "canceled";
        subscription.CurrentPeriodEnd = GetCurrentPeriodEnd(stripeSubscription);
        subscription.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.CompleteAsync();
    }

    private async Task UpsertSubscriptionAsync(StripeSubscription stripeSubscription, Guid? userId = null, string? customerId = null)
    {
        var resolvedCustomerId = customerId ?? stripeSubscription.CustomerId;
        var planId = ResolvePlanId(stripeSubscription);
        var currentPeriodEnd = GetCurrentPeriodEnd(stripeSubscription);

        var subscription = await _unitOfWork.Subscriptions.GetByProviderSubscriptionIdAsync(stripeSubscription.Id);
        if (subscription == null && !string.IsNullOrWhiteSpace(resolvedCustomerId))
        {
            subscription = await _unitOfWork.Subscriptions.GetLatestByProviderCustomerIdAsync(resolvedCustomerId);
        }

        if (subscription == null)
        {
            var resolvedUserId = userId ?? ResolveUserIdFromMetadata(stripeSubscription);
            if (resolvedUserId == null)
            {
                return;
            }

            subscription = new DomainSubscription
            {
                Id = Guid.NewGuid(),
                UserId = resolvedUserId.Value,
                PaymentProvider = "stripe",
                ProviderCustomerId = resolvedCustomerId ?? string.Empty,
                ProviderSubscriptionId = stripeSubscription.Id,
                PlanId = planId,
                Status = stripeSubscription.Status,
                CurrentPeriodEnd = currentPeriodEnd,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Subscriptions.AddAsync(subscription);
        }
        else
        {
            subscription.ProviderCustomerId = resolvedCustomerId ?? subscription.ProviderCustomerId;
            subscription.ProviderSubscriptionId = stripeSubscription.Id;
            subscription.PlanId = planId;
            subscription.Status = stripeSubscription.Status;
            subscription.CurrentPeriodEnd = currentPeriodEnd;
            subscription.UpdatedAt = DateTime.UtcNow;
        }

        await _unitOfWork.CompleteAsync();
    }

    private Guid? ResolveUserIdFromMetadata(StripeSubscription stripeSubscription)
    {
        if (stripeSubscription.Metadata.TryGetValue("user_id", out var userIdValue) &&
            Guid.TryParse(userIdValue, out var userId))
        {
            return userId;
        }

        return null;
    }

    private string ResolvePlanId(StripeSubscription stripeSubscription)
    {
        if (stripeSubscription.Metadata.TryGetValue("plan_id", out var planId) && !string.IsNullOrWhiteSpace(planId))
        {
            return planId;
        }

        var priceId = stripeSubscription.Items?.Data?.FirstOrDefault()?.Price?.Id;
        if (!string.IsNullOrWhiteSpace(priceId) && priceId == _configuration["Stripe:Prices:ProYearly"])
        {
            return "pro_yearly";
        }

        return "pro_monthly";
    }

    private DateTime GetCurrentPeriodEnd(StripeSubscription stripeSubscription)
    {
        var periodEnd = stripeSubscription.Items?.Data?.FirstOrDefault()?.CurrentPeriodEnd;
        return periodEnd == null || periodEnd == default
            ? DateTime.UtcNow
            : periodEnd.Value;
    }

    private string? GetPriceId(string normalizedPlanId)
    {
        return normalizedPlanId == "pro_yearly"
            ? _configuration["Stripe:Prices:ProYearly"]
            : _configuration["Stripe:Prices:ProMonthly"];
    }

    private static string NormalizePlanId(string planId)
    {
        return planId.Equals("yearly", StringComparison.OrdinalIgnoreCase) ||
               planId.Equals("pro_yearly", StringComparison.OrdinalIgnoreCase)
            ? "pro_yearly"
            : "pro_monthly";
    }
}
