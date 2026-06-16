namespace ReviewLoom.Application.DTOs;

public class CampaignStatsDto
{
    public long TotalScans { get; set; }
    public long PositiveScans { get; set; }
    public long NegativeScans { get; set; }

    public CampaignStatsDto() { }

    public CampaignStatsDto(long totalScans, long positiveScans, long negativeScans)
    {
        TotalScans = totalScans;
        PositiveScans = positiveScans;
        NegativeScans = negativeScans;
    }
}
