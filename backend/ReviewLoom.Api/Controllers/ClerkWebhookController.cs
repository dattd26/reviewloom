using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Interfaces;
using Svix;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("api/webhooks")]
public class ClerkWebhookController : ControllerBase
{
    private readonly string _webhookSecret;
    private readonly IUnitOfWork _unitOfWork;

    public ClerkWebhookController(IConfiguration configuration, IUnitOfWork unitOfWork)
    {
        // Add "Clerk:WebhookSecret" in appsettings.json
        _webhookSecret = configuration["Clerk:WebhookSecret"] ?? string.Empty;
        _unitOfWork = unitOfWork;
    }

    [HttpPost("clerk")]
    public async Task<IActionResult> HandleClerkWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        
        var svixId = Request.Headers["svix-id"].ToString();
        var svixTimestamp = Request.Headers["svix-timestamp"].ToString();
        var svixSignature = Request.Headers["svix-signature"].ToString();

        if (string.IsNullOrEmpty(svixId) || string.IsNullOrEmpty(svixTimestamp) || string.IsNullOrEmpty(svixSignature))
        {
            return BadRequest("Missing Svix headers");
        }

        var wh = new Webhook(_webhookSecret);
        try
        {
            var headers = new System.Net.WebHeaderCollection
            {
                { "svix-id", svixId },
                { "svix-timestamp", svixTimestamp },
                { "svix-signature", svixSignature }
            };

            // Verify signature
            wh.Verify(json, headers);
        }
        catch (Svix.Exceptions.WebhookVerificationException)
        {
            return BadRequest("Invalid signature");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        using var data = JsonDocument.Parse(json);
        var eventType = data.RootElement.GetProperty("type").GetString();

        if (eventType == "user.created")
        {
            var userObj = data.RootElement.GetProperty("data");
            var clerkId = userObj.GetProperty("id").GetString();
            
            // Clerk might have multiple emails, get the primary one
            var emailAddresses = userObj.GetProperty("email_addresses");
            var primaryEmailId = userObj.TryGetProperty("primary_email_address_id", out var pEmailId) ? pEmailId.GetString() : null;
            
            string? email = null;
            if (emailAddresses.GetArrayLength() > 0)
            {
                if (!string.IsNullOrEmpty(primaryEmailId))
                {
                    foreach (var emailElement in emailAddresses.EnumerateArray())
                    {
                        if (emailElement.GetProperty("id").GetString() == primaryEmailId)
                        {
                            email = emailElement.GetProperty("email_address").GetString();
                            break;
                        }
                    }
                }
                
                if (string.IsNullOrEmpty(email))
                {
                     email = emailAddresses[0].GetProperty("email_address").GetString();
                }
            }

            if (!string.IsNullOrEmpty(clerkId) && !string.IsNullOrEmpty(email))
            {
                var existingUser = await _unitOfWork.Users.GetByClerkIdAsync(clerkId);
                if (existingUser == null)
                {
                    var newUser = new User
                    {
                        Id = Guid.NewGuid(),
                        ClerkId = clerkId,
                        Email = email,
                        CreatedAt = DateTime.UtcNow
                    };
                    
                    // Attempt to extract name if available (optional)
                    if (userObj.TryGetProperty("first_name", out var firstNameElem) && firstNameElem.ValueKind == JsonValueKind.String)
                    {
                        newUser.BusinessName = firstNameElem.GetString(); // Use as fallback business name
                    }

                    await _unitOfWork.Users.AddAsync(newUser);
                    await _unitOfWork.CompleteAsync();
                }
            }
        }
        else if (eventType == "user.deleted")
        {
            var userObj = data.RootElement.GetProperty("data");
            var clerkId = userObj.GetProperty("id").GetString();

            if (!string.IsNullOrEmpty(clerkId))
            {
                var existingUser = await _unitOfWork.Users.GetByClerkIdAsync(clerkId);
                if (existingUser != null)
                {
                    _unitOfWork.Users.Remove(existingUser);
                    await _unitOfWork.CompleteAsync();
                }
            }
        }

        return Ok();
    }
}
