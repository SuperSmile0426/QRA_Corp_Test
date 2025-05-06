using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RequirementAnalyzer.API.Models;
using RequirementAnalyzer.API.Repositories;
using RequirementAnalyzer.API.Services;
using System.Net.Http;
using System.Text.Json;
using System.Collections.Generic;

namespace RequirementAnalyzer.API.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class AnalysisController : ControllerBase
    {
        private readonly IQraAnalysisService _qraAnalysisService;
        private readonly IRunHistoryRepository _runHistoryRepository;
        private readonly ILogger<AnalysisController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public AnalysisController(
            IQraAnalysisService qraAnalysisService,
            IRunHistoryRepository runHistoryRepository,
            ILogger<AnalysisController> logger,
            IHttpClientFactory httpClientFactory)
        {
            _qraAnalysisService = qraAnalysisService;
            _runHistoryRepository = runHistoryRepository;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost]
        public async Task<ActionResult<AnalyzeRequirementsResponseV3>> AnalyzeRequirements(
            [FromBody] AnalyzeRequirementsRequest request)
        {
            try
            {
                var response = await _qraAnalysisService.AnalyzeRequirementsAsync(request);

                // Extract the required data from the response
                var record = new RunHistoryRecord
                {
                    // Timestamp will be set by the repository
                    Requirements = request.Requirements,
                    ConfigurationId = request.Options?.ConfigurationId,
                    OverallScore = response.overallScore,
                    WarningCount = response.warningCount
                };

                _logger.LogInformation(
                    "Saving analysis record - Requirements: {Count}, Score: {Score}, Warnings: {Warnings}",
                    record.Requirements.Count,
                    record.OverallScore,
                    record.WarningCount);

                await _runHistoryRepository.InsertAsync(record);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing requirements");
                throw;
            }
        }

        [HttpGet("history")]
        public async Task<ActionResult<List<RunHistoryRecord>>> GetRunHistory()
        {
            try
            {
                var history = await _runHistoryRepository.GetAllAsync();
                return Ok(history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving run history");
                throw;
            }
        }

        [HttpGet("configuration/summary")]
        public async Task<IActionResult> GetConfigurationSummary()
        {
            try
            {
                var configs = await _qraAnalysisService.GetConfigurationSummaryAsync();
                return Ok(configs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching configuration summary");
                return StatusCode(500, "Failed to fetch configuration summary from external API.");
            }
        }
    }
} 