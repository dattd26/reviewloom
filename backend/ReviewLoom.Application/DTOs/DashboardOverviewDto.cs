using System.Collections.Generic;

namespace ReviewLoom.Application.DTOs;

public class DashboardOverviewDto
{
    public long TotalScans { get; set; }
    public double PositivePercentage { get; set; }
    public long NewPrivateFeedback { get; set; }
    public List<DailyScanGrowthDto> ScansGrowth { get; set; } = new();
    public List<RecentActivityDto> RecentActivity { get; set; } = new();
}
