using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RequirementAnalyzer.API.Models
{
    public class AnalyzeRequirementsRequest
    {
        [Required]
        public List<RequirementRequest> Requirements { get; set; } = new List<RequirementRequest>();
        
        public AnalyzeRequirementsOptionsRequest? Options { get; set; }
    }

    public class AnalyzeRequirementsOptionsRequest
    {
        public List<string>? AnalysisTypes { get; set; }
        public string? Mode { get; set; }
        public string? ConfigurationId { get; set; }
        public string? QwlVersion { get; set; }
        public AnalyzeRequirementsReportSettingsRequest? Report { get; set; }
    }

    public class AnalyzeRequirementsReportSettingsRequest
    {
        public string? Title { get; set; }
        public string? FileName { get; set; }
        public List<string>? Sections { get; set; }
    }
} 