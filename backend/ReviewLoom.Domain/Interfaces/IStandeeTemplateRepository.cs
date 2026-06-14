using System.Threading.Tasks;
using ReviewLoom.Domain.Entities;

namespace ReviewLoom.Domain.Interfaces;

public interface IStandeeTemplateRepository : IRepository<StandeeTemplate>
{
    Task<StandeeTemplate?> GetByIdAsync(string id);
}
