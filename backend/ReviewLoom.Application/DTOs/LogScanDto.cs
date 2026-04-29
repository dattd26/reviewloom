using System.ComponentModel.DataAnnotations;

namespace ReviewLoom.Application.DTOs;

public class LogScanDto
{
    [Required]
    [RegularExpression("^(positive|negative)$", ErrorMessage = "Action must be either 'positive' or 'negative'")]
    public string Action { get; set; } = string.Empty;
    public string? FeedbackName { get; set; }
    public string? FeedbackEmail { get; set; }
    public string? FeedbackMessage { get; set; }
}
