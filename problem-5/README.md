# Problem 5: A Crude Server

**Category:** Backend | Fullstack  
**Duration:** ≤ 16 hours (internship) / significantly less (professional)

## Task

Develop a backend server with ExpressJS. You are required to build a set of CRUD interfaces that allow a user to interact with the service. You are required to use TypeScript for this task.

## Requirements

### Interface Functionalities

- ✅ Create a resource
- ✅ List resources with basic filters
- ✅ Get details of a resource
- ✅ Update resource details
- ✅ Delete a resource

### Additional Requirements

- ✅ Connect your backend service with a simple database for data persistence
- ✅ Provide a `README.md` file with configuration instructions and the way to run the application

## Project Structure

```
problem-5/
├── README.md           # This file
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── src/
│   ├── index.ts        # Entry point
│   ├── app.ts          # Express app setup
│   ├── routes/         # API routes
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   ├── services/       # Business logic
│   └── config/         # Configuration files
└── .env.example        # Environment variables template
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Database (SQLite/PostgreSQL/MySQL - as configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your database configuration:
```env
PORT=3000
DATABASE_URL=your_database_url
NODE_ENV=development
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Build and run production:**
```bash
npm run build
npm start
```

**Run tests:**
```bash
npm test
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Endpoints

- `POST /api/resources` - Create a new resource
- `GET /api/resources` - List all resources (with filters)
- `GET /api/resources/:id` - Get a specific resource
- `PUT /api/resources/:id` - Update a resource
- `DELETE /api/resources/:id` - Delete a resource

### Example Requests

**Create Resource:**
```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name": "Example", "description": "Example description"}'
```

**List Resources:**
```bash
curl http://localhost:3000/api/resources?limit=10&offset=0
```

**Get Resource:**
```bash
curl http://localhost:3000/api/resources/1
```

**Update Resource:**
```bash
curl -X PUT http://localhost:3000/api/resources/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'
```

**Delete Resource:**
```bash
curl -X DELETE http://localhost:3000/api/resources/1
```

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** (To be configured - SQLite recommended for simplicity)
- **ORM/Query Builder:** (To be configured)

## Notes

- All endpoints return JSON responses
- Error handling is implemented with appropriate HTTP status codes
- Input validation is performed on all requests
- Database migrations and seeders can be found in the `src/db/` directory

