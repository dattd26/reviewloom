using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Application.Services;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class BillingController : ControllerBase
{
    private readonly IStripeService _stripeService;
    private readonly IBillingOverviewService _billingOverviewService;
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public BillingController(
        IStripeService stripeService,
        IBillingOverviewService billingOverviewService,
        IUserService userService,
        IConfiguration configuration)
    {
        _stripeService = stripeService;
        _billingOverviewService = billingOverviewService;
        _userService = userService;
        _configuration = configuration;
    }

    [Authorize]
    [HttpPost("create-checkout-session")]
    public async Task<IActionResult> CreateCheckoutSession([FromBody] CreateCheckoutRequest request)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null) return Unauthorized();

        var frontendBaseUrl = GetFrontendBaseUrl();
        var successUrl = $"{frontendBaseUrl}/dashboard/settings?checkout=success&session_id={{CHECKOUT_SESSION_ID}}";
        var cancelUrl = $"{frontendBaseUrl}/dashboard/upgrade?checkout=cancelled";

        try
        {
            var url = await _stripeService.CreateCheckoutSessionAsync(userId.Value.ToString(), request.PlanId, successUrl, cancelUrl);
            return Ok(new { Url = url });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("create-portal-session")]
    public async Task<IActionResult> CreatePortalSession()
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null) return Unauthorized();

        try
        {
            var url = await _stripeService.CreateBillingPortalSessionAsync(userId.Value, $"{GetFrontendBaseUrl()}/dashboard/settings");
            return Ok(new { Url = url });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
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

        return await _userService.GetUserIdByClerkIdAsync(clerkId);
    }

    private string GetFrontendBaseUrl()
    {
        return (_configuration["Frontend:BaseUrl"] ?? "http://localhost:3000").TrimEnd('/');
    }
}

public class CreateCheckoutRequest
{
    public string PlanId { get; set; } = string.Empty;
}
