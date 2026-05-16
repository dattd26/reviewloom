using System.ComponentModel.DataAnnotations;

namespace ReviewLoom.Application.DTOs;

public class LogScanDto
{
    [Required]
    public int Rating { get; set; }

    [RegularExpression("^(positive|negative)$", ErrorMessage = "Action must be either 'positive' or 'negative'")]
    public string? Action { get; set; }

    public string? FeedbackName { get; set; }
    public string? FeedbackEmail { get; set; }
    public string? FeedbackMessage { get; set; }
}
