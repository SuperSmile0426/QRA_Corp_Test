using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using RequirementAnalyzer.API.Models;

namespace RequirementAnalyzer.API.Repositories
{
    public class MongoRunHistoryRepository : IRunHistoryRepository
    {
        private readonly IMongoCollection<RunHistoryRecord> _collection;
        private readonly ILogger<MongoRunHistoryRepository> _logger;
        private const string CollectionName = "runHistory";

        public MongoRunHistoryRepository(IConfiguration configuration, ILogger<MongoRunHistoryRepository> logger)
        {
            _logger = logger;
            try
            {
                var connectionString = configuration["MongoDB:ConnectionString"];
                var databaseName = configuration["MongoDB:DatabaseName"];

                if (string.IsNullOrEmpty(connectionString))
                    throw new ArgumentException("MongoDB connection string is not configured");

                if (string.IsNullOrEmpty(databaseName))
                    throw new ArgumentException("MongoDB database name is not configured");

                _logger.LogInformation("Connecting to MongoDB at {ConnectionString}", connectionString);
                
                var client = new MongoClient(connectionString);
                
                // Drop existing database if it exists with different case
                var adminDb = client.GetDatabase("admin");
                var existingDbs = adminDb.RunCommand<MongoDB.Bson.BsonDocument>(new MongoDB.Bson.BsonDocument("listDatabases", 1));
                var databases = existingDbs["databases"].AsBsonArray;
                
                foreach (var db in databases)
                {
                    var dbName = db["name"].AsString;
                    if (dbName.Equals(databaseName, StringComparison.OrdinalIgnoreCase) && 
                        !dbName.Equals(databaseName, StringComparison.Ordinal))
                    {
                        _logger.LogWarning("Dropping database with incorrect case: {DbName}", dbName);
                        client.DropDatabase(dbName);
                    }
                }

                var database = client.GetDatabase(databaseName);
                _collection = database.GetCollection<RunHistoryRecord>(CollectionName);

                // Verify connection
                database.RunCommandAsync((Command<MongoDB.Bson.BsonDocument>)"{ping:1}").Wait();
                _logger.LogInformation("Successfully connected to MongoDB");

                // Create indexes
                var indexKeys = Builders<RunHistoryRecord>.IndexKeys
                    .Ascending(x => x.Timestamp)
                    .Ascending(x => x.ConfigurationId);
                
                var indexOptions = new CreateIndexOptions { Background = true };
                var indexModel = new CreateIndexModel<RunHistoryRecord>(indexKeys, indexOptions);
                
                _collection.Indexes.CreateOne(indexModel);
                _logger.LogInformation("MongoDB indexes created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to initialize MongoDB connection");
                throw;
            }
        }

        public async Task<string> InsertAsync(RunHistoryRecord record)
        {
            try
            {
                if (record == null)
                    throw new ArgumentNullException(nameof(record));

                record.Timestamp = DateTime.UtcNow;
                await _collection.InsertOneAsync(record);
                _logger.LogInformation("Successfully inserted record with ID: {Id}", record.Id);
                return record.Id;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to insert record into MongoDB");
                throw;
            }
        }

        public async Task<List<RunHistoryRecord>> GetAllAsync()
        {
            try
            {
                var sort = Builders<RunHistoryRecord>.Sort.Descending(x => x.Timestamp);
                var records = await _collection.Find(_ => true)
                                            .Sort(sort)
                                            .ToListAsync();
                
                _logger.LogInformation("Retrieved {Count} records from MongoDB", records.Count);
                return records;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to retrieve records from MongoDB");
                throw;
            }
        }
    }
} 