using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Application.Services;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class BillingController : ControllerBase
{
    private readonly IStripeService _stripeService;
    private readonly IBillingOverviewService _billingOverviewService;
    private readonly IUnitOfWork _unitOfWork;

    public BillingController(IStripeService stripeService, IBillingOverviewService billingOverviewService, IUnitOfWork unitOfWork)
    {
        _stripeService = stripeService;
        _billingOverviewService = billingOverviewService;
        _unitOfWork = unitOfWork;
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

    [Authorize]
    [HttpGet("subscription")]
    public async Task<IActionResult> GetSubscriptionOverview()
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null) return Unauthorized();

        var overview = await _billingOverviewService.GetBillingOverviewAsync(userId.Value);
        return Ok(overview);
    }

    private async Task<Guid?> GetCurrentUserIdAsync()
    {
        var clerkId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(clerkId)) return null;

        var user = await _unitOfWork.Users.GetByClerkIdAsync(clerkId);
        return user?.Id;
    }
}

public class CreateCheckoutRequest
{
    public string PlanId { get; set; } = string.Empty;
}
