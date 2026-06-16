using System;

namespace ReviewLoom.Application.DTOs;

public class DailyScanGrowthDto
{
    public DateTime Date { get; set; }
    public long Total { get; set; }
    public long Positive { get; set; }
    public long Negative { get; set; }
}
