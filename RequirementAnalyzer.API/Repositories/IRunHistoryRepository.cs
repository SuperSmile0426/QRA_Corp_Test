using System.Collections.Generic;
using System.Threading.Tasks;
using RequirementAnalyzer.API.Models;

namespace RequirementAnalyzer.API.Repositories
{
    public interface IRunHistoryRepository
    {
        Task<string> InsertAsync(RunHistoryRecord record);
        Task<List<RunHistoryRecord>> GetAllAsync();
    }
} 