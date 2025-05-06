# Requirement Analyzer

A full-stack application for analyzing requirements using the QRA API. The application consists of an Angular frontend and an ASP.NET Core backend.

## Prerequisites

- .NET 6 SDK
- Node.js 18+
- Docker and Docker Compose (for containerized deployment)
- MongoDB (included in Docker setup)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
QRA_PRIMARY_KEY=your_primary_key
QRA_SECONDARY_KEY=your_secondary_key
```

## Development Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd RequirementAnalyzer.API
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Run the application:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001` and `http://localhost:5000`.

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd requirement-analyzer-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   ng serve
   ```

The application will be available at `http://localhost:4200`.

## Docker Deployment

1. Build and run all services:
   ```bash
   docker-compose up --build
   ```

The application will be available at:
- Frontend: `http://localhost`
- Backend API: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Features

- Two-pane layout for requirements input and analysis results
- Real-time requirement analysis using QRA API
- MongoDB integration for storing analysis history
- Responsive design that works on desktop and mobile devices
- Docker support for easy deployment

## Architecture

### Frontend (Angular)
- Modern Angular 15+ application
- Responsive two-pane layout
- Real-time analysis results display
- Form validation and error handling

### Backend (ASP.NET Core)
- RESTful API endpoints
- MongoDB integration for data persistence
- QRA API integration
- Swagger/OpenAPI documentation

### Database
- MongoDB for storing analysis history
- Persistent volume in Docker setup

## API Documentation

Once the backend is running, you can access the Swagger UI at:
- Development: `https://localhost:5001/swagger`
- Docker: `http://localhost:5000/swagger`