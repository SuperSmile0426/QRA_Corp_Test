using System.Threading.Tasks;
using RequirementAnalyzer.API.Models;

namespace RequirementAnalyzer.API.Services
{
    public interface IQraAnalysisService
    {
        Task<AnalyzeRequirementsResponseV3> AnalyzeRequirementsAsync(AnalyzeRequirementsRequest request);
        Task<List<ConfigurationSummary>> GetConfigurationSummaryAsync();
    }
} 