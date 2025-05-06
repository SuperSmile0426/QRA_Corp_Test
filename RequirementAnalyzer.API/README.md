# Requirement Analyzer API

The Requirement Analyzer API is a robust backend service for analyzing requirements and storing analysis history. Built with ASP.NET Core 6.0, it integrates with MongoDB for persistence and provides a RESTful interface for frontend and external clients. This service is a core component of the Requirement Analyzer application suite.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [API Documentation](#api-documentation)
- [Endpoints](#endpoints)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)

## Features
- Analyze requirements using the QRA API
- Store and retrieve analysis history in MongoDB
- RESTful API endpoints
- Integrated Swagger/OpenAPI documentation
- CORS support for frontend integration

## Architecture
- **Controllers:** Handle HTTP requests and responses
- **Services:** Business logic and QRA API integration
- **Repositories:** MongoDB data access and persistence
- **Models:** Request/response and domain data structures

## Prerequisites
- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or cloud instance)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

## Environment Variables
Set the following environment variables (or use a `.env` file):

- `QRA_PRIMARY_KEY`: Your QRA API primary key
- `QRA_SECONDARY_KEY`: Your QRA API secondary key
- `MongoDB__ConnectionString`: MongoDB connection string (default: `mongodb://localhost:27017`)
- `MongoDB__DatabaseName`: MongoDB database name (default: `RequirementAnalyzer`)

## Running Locally
1. Ensure MongoDB is running locally or accessible via the connection string.
2. Set the required environment variables.
3. Restore dependencies and run the API:
   ```bash
   dotnet restore
   dotnet run
   ```
4. The API will be available at `https://localhost:5001` and `http://localhost:5000`.

## Running with Docker
1. Build the Docker image:
   ```bash
   docker build -t requirement-analyzer-api .
   ```
2. Run the container:
   ```bash
   docker run -p 5000:5000 \
     -e QRA_PRIMARY_KEY=your_primary_key \
     -e QRA_SECONDARY_KEY=your_secondary_key \
     -e MongoDB__ConnectionString=your_mongo_connection_string \
     -e MongoDB__DatabaseName=your_database_name \
     requirement-analyzer-api
   ```

## API Documentation
Interactive API documentation is available via Swagger once the application is running:
- Local: `https://localhost:5001/swagger` or `http://localhost:5000/swagger`
- Docker: `http://localhost:5000/swagger`

## Endpoints
- `POST /v1/analysis` — Analyze requirements
- `GET /v1/analysis/configuration/summary` — Get configuration summary
- (See Swagger UI for full details)

## Technology Stack
- **Framework:** ASP.NET Core 6.0
- **Database:** MongoDB (via MongoDB.Driver)
- **API Documentation:** Swagger/OpenAPI (Swashbuckle)
- **Containerization:** Docker
- **Other:** CORS support for frontend integration