# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AFI (Application Form Interface) project with a containerized architecture consisting of:
- **Backend**: Node.js/Express API server with PostgreSQL database integration
- **Frontend**: Currently empty directory (likely planned for future frontend implementation)
- **PDF Service**: Gotenberg container for PDF generation
- **Database**: PostgreSQL (currently commented out in docker-compose)

## Architecture

### Backend (`backend/`)
- **Technology**: Node.js with Express.js framework
- **Main File**: `server.js` - Simple API server with database connectivity
- **Database**: PostgreSQL connection using `pg` library
- **Dependencies**: express, body-parser, cors, pg
- **Port**: 5000
- **API Endpoints**: Currently only `/api/test` for database connectivity testing

### Database Configuration
- **External Database**: Currently connects to external PostgreSQL instance at `185.244.219.128:5432`
- **Database**: `afi_app`
- **User**: `afi_user`
- **Note**: Database credentials are hardcoded in `server.js` (should be moved to environment variables)

### Container Services
- **Backend**: Containerized Node.js app on port 5000
- **Frontend**: Planned container on port 3000 (directory exists but empty)
- **PDF**: Gotenberg service on port 3001 for PDF generation capabilities
- **Database**: Local PostgreSQL container configuration available but commented out

## Development Commands

### Docker Development
```bash
# Start all services
docker-compose up

# Start services in background
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop services
docker-compose down
```

### Backend Development
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run server directly
node server.js
```

## Project Structure
```
AFI-application-form/
├── backend/
│   ├── server.js           # Main Express server
│   ├── package.json        # Node.js dependencies
│   ├── Dockerfile          # Backend container definition
│   └── node_modules/       # Installed packages
├── frontend/               # Empty directory for future frontend
├── db_data/               # Database volume directory
├── docker-compose.yml     # Container orchestration
└── .gitignore            # Git ignore rules
```

## Security Considerations

**IMPORTANT**: The database credentials are currently hardcoded in `server.js`. For production, these should be:
- Moved to environment variables
- Used via Docker secrets or secure configuration management
- Never committed to version control

## Development Notes

- The frontend directory is empty, suggesting this is a backend-first implementation
- The project uses an external database rather than the containerized PostgreSQL
- PDF generation capability is available via Gotenberg service
- No test framework is currently configured (package.json shows default "no test specified")