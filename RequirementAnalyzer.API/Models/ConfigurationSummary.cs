using System;

namespace RequirementAnalyzer.API.Models
{
    public class ConfigurationSummary
    {
        public string ConfigurationId { get; set; }
        public int ConfigurationVersion { get; set; }
        public string ConfigurationName { get; set; }
        public string ConfigurationSchemaVersion { get; set; }
        public string MinClientVersion { get; set; }
        public string PublishedBy { get; set; }
        public long ModifiedDate { get; set; }
    }
} 