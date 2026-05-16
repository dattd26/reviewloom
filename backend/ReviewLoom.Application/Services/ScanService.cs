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

    public async Task LogScanAsync(string slug, LogScanDto request)
    {
        var campaign = await _unitOfWork.Campaigns.GetBySlugAsync(slug);

        if (campaign == null)
            throw new ArgumentException("Campaign not found");

        request.Action = (request.Action ?? (request.Rating >= 4 ? "positive" : "negative"))!;

        await _scanRepository.LogScanAsync(campaign.Id, request.Action, request.Rating, request.FeedbackName, request.FeedbackEmail, request.FeedbackMessage);
    }
}
