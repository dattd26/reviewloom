using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    private readonly IUnitOfWork _unitOfWork;

    public DashboardController(IDashboardService dashboardService, IUnitOfWork unitOfWork)
    {
        _dashboardService = dashboardService;
        _unitOfWork = unitOfWork;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var userId = await GetCurrentUserIdAsync();
        if (userId == null) return Unauthorized();

        try
        {
            var overview = await _dashboardService.GetDashboardOverviewAsync(userId.Value, fromDate, toDate);
            return Ok(overview);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private async Task<Guid?> GetCurrentUserIdAsync()
    {
        var clerkId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(clerkId)) return null;

        var user = await _unitOfWork.Users.GetByClerkIdAsync(clerkId);
        return user?.Id;
    }
}
