using System.Threading.Tasks;

namespace ReviewLoom.Application.Services;

public interface IStripeService
{
    Task<string> CreateCheckoutSessionAsync(string userId, string planId, string successUrl, string cancelUrl);
    Task<string> CreateBillingPortalSessionAsync(Guid userId, string returnUrl);
    Task HandleWebhookAsync(string json, string signature);
}
