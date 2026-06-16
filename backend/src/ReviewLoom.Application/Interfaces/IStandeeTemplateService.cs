using System.Collections.Generic;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;

namespace ReviewLoom.Application.Interfaces;

public interface IStandeeTemplateService
{
    Task<IEnumerable<StandeeTemplateDto>> GetAllTemplatesAsync();
    Task<StandeeTemplateDto?> GetTemplateByIdAsync(string id);
}
