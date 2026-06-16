using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReviewLoom.Application.Interfaces;
using System.Threading.Tasks;

namespace ReviewLoom.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class MediaController : ControllerBase
{
    private readonly IMediaService _mediaService;

    public MediaController(IMediaService mediaService)
    {
        _mediaService = mediaService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        // Validate file type
        var extension = System.IO.Path.GetExtension(file.FileName).ToLower();
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        if (!System.Linq.Enumerable.Contains(allowedExtensions, extension))
        {
            return BadRequest("Unsupported file type.");
        }

        using var stream = file.OpenReadStream();
        var url = await _mediaService.UploadImageAsync(stream, file.FileName);

        return Ok(new { url });
    }
}
