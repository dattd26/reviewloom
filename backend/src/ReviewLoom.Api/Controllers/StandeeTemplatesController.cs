using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.Interfaces;
using ReviewLoom.Application.DTOs;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class StandeeTemplatesController : ControllerBase
{
    private readonly IStandeeTemplateService _standeeTemplateService;

    public StandeeTemplatesController(IStandeeTemplateService standeeTemplateService)
    {
        _standeeTemplateService = standeeTemplateService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StandeeTemplateDto>>> GetAllTemplates()
    {
        var templates = await _standeeTemplateService.GetAllTemplatesAsync();
        return Ok(templates);
    }
}
