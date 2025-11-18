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

### Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Create `.env` file for custom configuration:
```bash
# Create .env file (optional - defaults work out of the box)
cat > .env << EOF
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/database.db
EOF
```

The database (SQLite) will be automatically created in the `data/` directory on first run. No additional database setup is required.

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

#### `POST /api/resources` - Create a new resource
Creates a new resource with the provided data.

**Request Body:**
```json
{
  "name": "Resource Name",
  "description": "Optional description"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Resource Name",
  "description": "Optional description",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name": "Example", "description": "Example description"}'
```

#### `GET /api/resources` - List all resources (with filters)
Retrieves a list of resources with optional filtering and pagination.

**Query Parameters:**
- `limit` (optional): Number of results to return (default: 100, max: 1000)
- `offset` (optional): Number of results to skip (default: 0)
- `search` (optional): Search term to filter by name or description

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "name": "Resource Name",
      "description": "Description",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 100,
    "offset": 0
  }
}
```

**Examples:**
```bash
# Get all resources
curl http://localhost:3000/api/resources

# With pagination
curl http://localhost:3000/api/resources?limit=10&offset=0

# With search
curl http://localhost:3000/api/resources?search=example
```

#### `GET /api/resources/:id` - Get a specific resource
Retrieves a single resource by ID.

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Resource Name",
  "description": "Description",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Example:**
```bash
curl http://localhost:3000/api/resources/1
```

#### `PUT /api/resources/:id` - Update a resource
Updates an existing resource. All fields are optional.

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Updated Name",
  "description": "Updated description",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T01:00:00.000Z"
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/resources/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "description": "New description"}'
```

#### `DELETE /api/resources/:id` - Delete a resource
Deletes a resource by ID.

**Response:** `204 No Content`

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/resources/1
```

### Error Responses

All endpoints return appropriate HTTP status codes:

- `400 Bad Request` - Validation error (invalid input)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** SQLite (better-sqlite3)
- **Database Location:** `./data/database.db` (created automatically)

## Project Structure

```
problem-5/
├── README.md              # This file
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Environment variables template (optional)
├── data/                  # Database directory (auto-created)
│   └── database.db        # SQLite database file
└── src/
    ├── index.ts           # Entry point
    ├── app.ts             # Express app setup
    ├── config/
    │   └── database.ts    # Database configuration and initialization
    ├── models/
    │   └── Resource.ts    # Resource model and DTOs
    ├── services/
    │   └── resourceService.ts  # Business logic and database operations
    ├── controllers/
    │   └── resourceController.ts  # Request handlers
    └── routes/
        └── resourceRoutes.ts     # API route definitions
```

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Input validation on all endpoints
- ✅ Pagination support (limit/offset)
- ✅ Search functionality (by name or description)
- ✅ Error handling with appropriate HTTP status codes
- ✅ SQLite database with automatic initialization
- ✅ TypeScript for type safety
- ✅ Clean architecture (models, services, controllers, routes)

## Notes

- All endpoints return JSON responses
- Error handling is implemented with appropriate HTTP status codes
- Input validation is performed on all requests
- Database is automatically created and initialized on first run
- The database file is stored in the `data/` directory
- All timestamps are stored in ISO 8601 format

