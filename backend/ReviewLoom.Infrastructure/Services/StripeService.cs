using Stripe;
using Stripe.Checkout;
using ReviewLoom.Application.Services;

namespace ReviewLoom.Infrastructure.Services;

public class StripeService : IStripeService
{
    // These should come from Configuration in a real app
    private readonly string _webhookSecret = "whsec_...";

    public async Task<string> CreateCheckoutSessionAsync(string userId, string planId, string successUrl, string cancelUrl)
    {
        // TODO: Replace with actual Stripe price IDs
        var priceId = planId == "yearly" ? "price_yearly_id" : "price_monthly_id";

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Price = priceId,
                    Quantity = 1,
                },
            },
            Mode = "subscription",
            SuccessUrl = successUrl,
            CancelUrl = cancelUrl,
            ClientReferenceId = userId
        };

        var service = new SessionService();
        Session session = await service.CreateAsync(options);

        return session.Url;
    }

    public Task HandleWebhookAsync(string json, string signature)
    {
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(json, signature, _webhookSecret);

            // Handle the event
            if (stripeEvent.Type == EventTypes.CheckoutSessionCompleted)
            {
                var session = stripeEvent.Data.Object as Session;
                // TODO: Update subscription in DB based on session.ClientReferenceId
            }
            else if (stripeEvent.Type == EventTypes.CustomerSubscriptionUpdated)
            {
                var subscription = stripeEvent.Data.Object as Subscription;
                // TODO: Update subscription status in DB
            }

            return Task.CompletedTask;
        }
        catch (StripeException e)
        {
            throw new Exception("Webhook error", e);
        }
    }
}
