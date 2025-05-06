using RequirementAnalyzer.API.Models;

namespace RequirementAnalyzer.API.Services
{
    public interface IQraClient
    {
        Task<AnalyzeRequirementsResponseV3> AnalyzeAsync(AnalyzeRequirementsRequest request);
        Task<ConfigurationSummary[]> GetConfigurationSummaryAsync();
    }
} 