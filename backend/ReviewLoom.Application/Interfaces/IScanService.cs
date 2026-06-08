using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;

namespace ReviewLoom.Application.Interfaces;

public interface IScanService
{
    Task<ScanResultDto> LogScanAsync(string slug, LogScanDto request);
}
