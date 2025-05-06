using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RequirementAnalyzer.API.Models;

namespace RequirementAnalyzer.API.Services
{
    public class QraAnalysisService : IQraAnalysisService
    {
        private readonly HttpClient _httpClient;
        private readonly string _primaryKey;
        private readonly string _apiBaseUrl;
        private readonly ILogger<QraAnalysisService> _logger;

        public QraAnalysisService(
            HttpClient httpClient, 
            IConfiguration configuration,
            ILogger<QraAnalysisService> logger)
        {
            _httpClient = httpClient;
            _primaryKey = configuration["QRA_PRIMARY_KEY"];
            _apiBaseUrl = "https://dev-api.qracloud.com/qwl/v1/analysis";
            _logger = logger;
        }

        public async Task<AnalyzeRequirementsResponseV3> AnalyzeRequirementsAsync(AnalyzeRequirementsRequest request)
        {
            try
            {
                // Ensure we have at least one requirement
                if (request.Requirements == null || request.Requirements.Count == 0)
                {
                    throw new ArgumentException("At least one requirement must be provided");
                }

                // Build the URL with optional parameters
                var queryParams = new List<string>();
                if (request.Options?.QwlVersion != null)
                {
                    queryParams.Add($"qwlVersion={request.Options.QwlVersion}");
                }
                
                var url = queryParams.Count > 0 
                    ? $"{_apiBaseUrl}?{string.Join("&", queryParams)}"
                    : _apiBaseUrl;
                
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("x-qra-subscription-key", _primaryKey);

                var requestJson = JsonSerializer.Serialize(request, new JsonSerializerOptions 
                { 
                    WriteIndented = true,
                    DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
                });
                
                _logger.LogInformation("Request URL: {Url}", url);
                _logger.LogInformation("Request Headers: {Headers}", string.Join(", ", _httpClient.DefaultRequestHeaders.Select(h => $"{h.Key}: {string.Join(", ", h.Value)}")));
                _logger.LogInformation("Request Body: {Body}", requestJson);

                var content = new StringContent(
                    requestJson,
                    Encoding.UTF8,
                    "application/json");

                var response = await _httpClient.PostAsync(url, content);
                var responseContent = await response.Content.ReadAsStringAsync();
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("API Error: Status Code: {StatusCode}", response.StatusCode);
                    _logger.LogError("API Error Response: {Content}", responseContent);
                    
                    // Try to parse the error response as JSON
                    try 
                    {
                        var errorResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
                        if (errorResponse.TryGetProperty("errors", out var errors))
                        {
                            _logger.LogError("Validation Errors: {Errors}", errors.ToString());
                        }
                    }
                    catch (JsonException)
                    {
                        _logger.LogError("Could not parse error response as JSON");
                    }
                    
                    throw new HttpRequestException($"API request failed with status code {response.StatusCode}. Response: {responseContent}");
                }

                _logger.LogInformation("Response: {Response}", responseContent);
                return JsonSerializer.Deserialize<AnalyzeRequirementsResponseV3>(responseContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AnalyzeRequirementsAsync");
                throw;
            }
        }

        public async Task<List<ConfigurationSummary>> GetConfigurationSummaryAsync()
        {
            try
            {
                var url = "https://dev-api.qracloud.com/qwl//v1/analysis/configuration/summary";
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("x-qra-subscription-key", _primaryKey);

                var response = await _httpClient.GetAsync(url);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("API Error: Status Code: {StatusCode}", response.StatusCode);
                    _logger.LogError("API Error Response: {Content}", responseContent);
                    throw new HttpRequestException($"API request failed with status code {response.StatusCode}. Response: {responseContent}");
                }

                _logger.LogInformation("Configuration Summary Response: {Response}", responseContent);
                return JsonSerializer.Deserialize<List<ConfigurationSummary>>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetConfigurationSummaryAsync");
                throw;
            }
        }
    }
} 