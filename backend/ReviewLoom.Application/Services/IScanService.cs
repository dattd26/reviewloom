using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;

namespace ReviewLoom.Application.Services;

public interface IScanService
{
    Task LogScanAsync(string slug, LogScanDto dto);
}
