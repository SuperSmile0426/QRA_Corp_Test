using Microsoft.OpenApi.Models;
using RequirementAnalyzer.API.Repositories;
using RequirementAnalyzer.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Requirement Analyzer API", Version = "v1" });
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// Register services
builder.Services.AddHttpClient();
builder.Services.AddScoped<IQraAnalysisService, QraAnalysisService>();
builder.Services.AddScoped<IRunHistoryRepository, MongoRunHistoryRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Requirement Analyzer API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// Log startup information
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Starting Requirement Analyzer API");
logger.LogInformation("MongoDB Connection String: {ConnectionString}", 
    builder.Configuration["MongoDB:ConnectionString"]);
logger.LogInformation("MongoDB Database Name: {DatabaseName}", 
    builder.Configuration["MongoDB:DatabaseName"]);

app.Run();
