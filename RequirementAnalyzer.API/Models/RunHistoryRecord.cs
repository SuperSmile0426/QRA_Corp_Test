using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RequirementAnalyzer.API.Models
{
    public class RunHistoryRecord
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("timestamp")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Timestamp { get; set; }

        [BsonElement("requirements")]
        public List<RequirementRequest> Requirements { get; set; } = new List<RequirementRequest>();

        [BsonElement("configuration")]
        public string ConfigurationId { get; set; }

        [BsonElement("overallScore")]
        [BsonRepresentation(BsonType.Double)]
        public double OverallScore { get; set; }

        [BsonElement("warningCount")]
        [BsonRepresentation(BsonType.Int64)]
        public long WarningCount { get; set; }
    }
} 