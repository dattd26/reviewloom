using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Domain.Entities;
using ReviewLoom.Domain.Interfaces;

namespace ReviewLoom.Application.Services;

public class StandeeTemplateService : IStandeeTemplateService
{
    private readonly IUnitOfWork _unitOfWork;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public StandeeTemplateService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<StandeeTemplateDto>> GetAllTemplatesAsync()
    {
        var templates = await _unitOfWork.StandeeTemplates.GetAllAsync();
        return templates.Select(MapToDto).ToList();
    }

    public async Task<StandeeTemplateDto?> GetTemplateByIdAsync(string id)
    {
        var template = await _unitOfWork.StandeeTemplates.GetByIdAsync(id);
        if (template == null) return null;

        return MapToDto(template);
    }

    private static StandeeTemplateDto MapToDto(StandeeTemplate entity)
    {
        StandeeTemplateSchemaDto schemaDto;
        try
        {
            schemaDto = JsonSerializer.Deserialize<StandeeTemplateSchemaDto>(entity.SchemaJson, JsonOptions) 
                        ?? new StandeeTemplateSchemaDto { Layout = entity.Id };
        }
        catch
        {
            schemaDto = new StandeeTemplateSchemaDto { Layout = entity.Id };
        }

        return new StandeeTemplateDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Category = entity.Category,
            IsPremium = entity.IsPremium,
            ThumbnailUrl = entity.ThumbnailUrl,
            Schema = schemaDto
        };
    }
}
