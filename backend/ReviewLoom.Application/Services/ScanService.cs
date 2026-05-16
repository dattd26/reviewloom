using System;
using System.Threading.Tasks;
using ReviewLoom.Application.DTOs;
using ReviewLoom.Domain.Interfaces;
using ReviewLoom.Application.Interfaces;

namespace ReviewLoom.Application.Services;

public class ScanService : IScanService
{
    private readonly IScanRepository _scanRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ScanService(IScanRepository scanRepository, IUnitOfWork unitOfWork)
    {
        _scanRepository = scanRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task LogScanAsync(string slug, LogScanDto dto)
    {
        // Get the campaign by slug to find the ID
        var campaign = await _unitOfWork.Campaigns.GetBySlugAsync(slug);
        
        if (campaign == null)
            throw new ArgumentException("Campaign not found");

        await _scanRepository.LogScanAsync(campaign.Id, dto.Action, dto.FeedbackName, dto.FeedbackEmail, dto.FeedbackMessage);
    }
}
