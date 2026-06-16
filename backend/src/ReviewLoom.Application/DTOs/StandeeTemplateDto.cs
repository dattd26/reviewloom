using System.Collections.Generic;

namespace ReviewLoom.Application.DTOs;

public class StandeeTemplateDto
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Category { get; set; } = null!;
    public bool IsPremium { get; set; }
    public string ThumbnailUrl { get; set; } = null!;
    public StandeeTemplateSchemaDto Schema { get; set; } = new();
}

public class StandeeTemplateSchemaDto
{
    public string Layout { get; set; } = null!;
    public List<string> EditableFields { get; set; } = new();
}
