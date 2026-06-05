using System;

namespace ReviewLoom.Application.DTOs;

public class BillingHistoryItemDto
{
    public DateTime Date { get; set; }
    public string Amount { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
