using System;

namespace ReviewLoom.Domain.Entities;

public class StandeeTemplate
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Category { get; set; } = null!;
    public bool IsPremium { get; set; }
    public string ThumbnailUrl { get; set; } = null!;
    public string SchemaJson { get; set; } = "{}";
}
