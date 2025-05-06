using System;
using System.ComponentModel.DataAnnotations;

namespace RequirementAnalyzer.API.Models
{
    public class RequirementRequest
    {
        [Required]
        public string DisplayId { get; set; } = string.Empty;
        
        [Required]
        public string Text { get; set; } = string.Empty;
    }
} 