using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.Services;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class BillingController : ControllerBase
{
    private readonly IStripeService _stripeService;

    public BillingController(IStripeService stripeService)
    {
        _stripeService = stripeService;
    }

    [Authorize]
    [HttpPost("create-checkout-session")]
    public async Task<IActionResult> CreateCheckoutSession([FromBody] CreateCheckoutRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var successUrl = "https://your-frontend-url.com/dashboard?session_id={CHECKOUT_SESSION_ID}";
        var cancelUrl = "https://your-frontend-url.com/dashboard";

        var url = await _stripeService.CreateCheckoutSessionAsync(userId, request.PlanId, successUrl, cancelUrl);

        return Ok(new { Url = url });
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var signature = Request.Headers["Stripe-Signature"];

        try
        {
            await _stripeService.HandleWebhookAsync(json, signature!);
            return Ok();
        }
        catch (System.Exception)
        {
            return BadRequest();
        }
    }
}

public class CreateCheckoutRequest
{
    public string PlanId { get; set; } = string.Empty;
}
