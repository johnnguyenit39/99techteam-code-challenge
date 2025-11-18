# Problem 6: Architecture

**Category:** Backend | Fullstack  
**Duration:** ≤ 8 hours (internship) / significantly less (professional)

## Task

Write the specification for a software module on the API service (backend application server).

## Deliverables

1. ✅ Create documentation for this module in a `README.md` file (this file)
2. ✅ Create a diagram to illustrate the flow of execution
3. ✅ Add additional comments for improvements you may have in the documentation

Your specification will be given to a backend engineering team to implement.

## Software Requirements

- We have a website with a scoreboard that shows the top 10 users' scores
- We want live updates of the scoreboard
- Users can perform an action (which we do not need to care what the action is); completing this action will increase the user's score
- Upon completion, the action will dispatch an API call to the application server to update the score
- We want to prevent malicious users from increasing scores without authorization

## Module Specification: Live Scoreboard System

### Overview

This module implements a real-time scoreboard system that displays the top 10 users' scores with live updates. The system includes:

- **Score Increment API**: Endpoint to update user scores after completing actions
- **Authentication & Authorization**: JWT-based security to prevent unauthorized access
- **Replay Attack Prevention**: ActionID validation to prevent malicious users from resubmitting the same request multiple times
- **Real-time Updates**: WebSocket/SSE-based broadcasting to keep all connected clients synchronized
- **Scalable Architecture**: Designed for horizontal scaling with Redis caching and message queuing

### Architecture Diagram

See [`diagram/diagram.png`](./diagram/diagram.png) for the detailed flow diagram illustrating the end-to-end execution process.

**Diagram Flow Summary:**
The diagram shows the complete flow from user action to real-time UI update:
1. User performs action → API call to `/api/score/increment`
2. Server verifies JWT token and authenticates user
3. Server validates ActionID to prevent replay attacks
4. Server updates score in database
5. Server fetches updated top 10 leaderboard
6. **Parallel execution**: HTTP response returned to client AND WebSocket broadcast sent to all connected clients
7. All connected clients (web/mobile) receive update and refresh their leaderboard UI in real-time

### Core Components

#### 1. Score Increment API
- **Endpoint:** `POST /api/score/increment`
- **Purpose:** Receive score increment requests from client actions
- **Authentication:** Required (JWT token in Authorization header)
- **Authorization:** User can only update their own score
- **Replay Protection:** ActionID validation to prevent duplicate requests

#### 2. Scoreboard Query API
- **Endpoint:** `GET /api/scores/leaderboard`
- **Purpose:** Retrieve top 10 scores
- **Authentication:** Optional (public leaderboard)
- **Response:** Array of top 10 user scores with ranks

#### 3. Real-time Update System
- **Technology:** WebSocket or Server-Sent Events (SSE)
- **Purpose:** Push live leaderboard updates to all connected clients
- **Events:**
  - `leaderboard_updated`: Broadcast when top 10 leaderboard changes
- **Clients:** Supports both web browsers and mobile applications

#### 4. Authentication & Authorization
- **JWT-based authentication** - Verifies user token before processing
- **ActionID validation** - Prevents replay attacks by tracking unique action IDs
- **Rate limiting** - Prevents abuse and DoS attacks
- **Score validation** - Ensures valid score increments

### Data Models

#### Score Model
```typescript
interface Score {
  userId: string;
  username: string;
  score: number;
  updatedAt: Date;
}
```

#### Score Increment Request
```typescript
interface ScoreIncrementRequest {
  userId: string;
  scoreIncrement: number; // Positive integer
  actionId: string; // Unique identifier for this action (prevents replay attacks)
}
```

#### ActionID Model
```typescript
interface ActionID {
  actionId: string; // Unique per action
  userId: string;
  timestamp: Date;
  expiresAt: Date; // TTL for action ID (e.g., 5 minutes)
}
```

### API Endpoints

#### POST /api/score/increment
Increment a user's score after completing an action.

**Request Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "user123",
  "scoreIncrement": 10,
  "actionId": "action-uuid-12345"
}
```

**Response (Success):**
```json
{
  "success": true,
  "newScore": 150,
  "rank": 5,
  "message": "Score updated successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User trying to update another user's score, or token user ID doesn't match request
- `400 Bad Request`: Invalid score increment, missing actionId, or duplicate actionId (replay attack detected)
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Database or server error

#### GET /api/scores/leaderboard
Get top 10 scores.

**Query Parameters:**
- `limit` (optional): Number of results (default: 10, max: 100)

**Response:**
```json
{
  "leaderboard": [
    {
      "userId": "user1",
      "username": "Player1",
      "score": 1000,
      "rank": 1
    },
    // ... top 10 entries
  ],
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Real-time Update Events (WebSocket/SSE)

#### Client → Server

**Subscribe to leaderboard updates:**
```json
{
  "event": "subscribe",
  "channel": "leaderboard"
}
```

#### Server → Client

**Leaderboard updated (broadcast to all connected clients):**
```json
{
  "event": "leaderboard_updated",
  "data": {
    "leaderboard": [
      {
        "userId": "user1",
        "username": "Player1",
        "score": 1000,
        "rank": 1
      },
      // ... top 10 entries
    ],
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Note:** This event is broadcast to all connected clients (web and mobile) whenever the top 10 leaderboard changes, ensuring real-time updates across all platforms.

### Security Considerations

1. **Authentication:**
   - All score increment requests require valid JWT token in Authorization header
   - Token must include user ID claim
   - Token verification happens before any processing

2. **Authorization:**
   - Users can only update their own scores
   - Validate `userId` in JWT token matches `userId` in request body
   - Reject requests where token user ID doesn't match request user ID

3. **Replay Attack Prevention (ActionID Validation):**
   - Each action must include a unique `actionId` in the request
   - Server maintains a cache/database of processed actionIds (with TTL, e.g., 5 minutes)
   - If an `actionId` is reused, reject the request as a replay attack
   - ActionIDs should be UUIDs or cryptographically secure random strings
   - Store actionId with userId and timestamp for audit purposes

4. **Rate Limiting:**
   - Limit score updates per user (e.g., 100 updates per minute)
   - Use token bucket or sliding window algorithm
   - Implement per-IP rate limiting as additional protection

5. **Input Validation:**
   - Validate `scoreIncrement` is positive integer
   - Validate `scoreIncrement` is within reasonable bounds (e.g., 1-1000)
   - Validate `actionId` is present and properly formatted
   - Sanitize all inputs to prevent injection attacks

6. **Score Validation:**
   - Prevent negative scores
   - Prevent unrealistic score jumps (detect anomalies)
   - Implement maximum score limits if applicable

### Database Schema

#### Scores Table
```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  INDEX idx_score (score DESC),
  INDEX idx_user_id (user_id)
);
```

#### ActionIDs Table (for replay attack prevention)
```sql
CREATE TABLE processed_action_ids (
  action_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- Auto-cleanup expired action IDs (run periodic job)
-- Or use Redis with TTL for better performance
```

### Implementation Flow (As per Diagram)

The execution flow follows this sequence, with parallel paths for HTTP response and real-time broadcasting:

#### 1. Score Increment Flow (Main Flow)
```
1. User Action in Web App
   ↓
2. POST /api/score/increment
   ↓
3. Verify Token & Authenticate User
   - Extract JWT token from Authorization header
   - Verify token signature and expiration
   - Extract userId from token claims
   ↓
4. Validate ActionID (Prevents Replay)
   - Check if actionId exists in processed_action_ids table/cache
   - If exists: Reject request (replay attack detected)
   - If not exists: Store actionId with TTL (e.g., 5 minutes)
   ↓
5. Validate Authorization
   - Ensure token userId matches request userId
   - Validate scoreIncrement is positive and within bounds
   ↓
6. Update User Score in Database
   - Atomic increment: UPDATE scores SET score = score + ? WHERE user_id = ?
   - Get updated score value
   ↓
7. Fetch Updated Top 10 Leaderboard
   - SELECT * FROM scores ORDER BY score DESC LIMIT 10
   - Compare with previous top 10 (if cached)
   ↓
8. Parallel Execution:
   
   Path A: Return Success/Error to Web App
   - Return HTTP 200 with newScore and rank
   - Or return appropriate error status code
   
   Path B: Broadcast Live Update (WebSocket/SSE)
   - If top 10 changed: Broadcast leaderboard_updated event
   - Send to all connected clients (web and mobile)
   ↓
9. Connected Clients Receive Update
   ↓
10. Leaderboard UI Updated in Real-time
```

#### 2. Leaderboard Query Flow
```
Client → GET /api/scores/leaderboard
→ Query Database (Top 10 with ORDER BY score DESC LIMIT 10)
→ Return Results (with caching if implemented)
```

#### 3. Real-time Subscription Flow
```
Client → WebSocket/SSE Connection
→ Send subscribe event with channel: "leaderboard"
→ Server adds client to leaderboard subscribers
→ Client receives leaderboard_updated events when top 10 changes
→ Client updates UI automatically
```

### Performance & Scalability Considerations

1. **Database Indexing:**
   - Index on `score` (DESC) for efficient top 10 queries
   - Index on `user_id` for user lookups
   - Index on `expires_at` in processed_action_ids for cleanup

2. **Caching Strategy:**
   - Cache top 10 leaderboard in Redis with 1-5 second TTL
   - Cache processed actionIds in Redis with TTL (better than database for high throughput)
   - Invalidate leaderboard cache on score updates
   - Use Redis SET with expiration for actionId deduplication

3. **WebSocket/SSE Optimization:**
   - Only broadcast if top 10 actually changed (compare before/after)
   - Use connection pooling and efficient message serialization
   - Implement connection limits per server instance
   - Consider using Redis Pub/Sub for multi-server WebSocket broadcasting

4. **Query Optimization:**
   - Use `LIMIT 10` with `ORDER BY score DESC` (covered by index)
   - Consider materialized views for very high traffic scenarios
   - Use database connection pooling

5. **Scalability Architecture:**
   - Horizontal scaling: Multiple API server instances behind load balancer
   - Use Redis for shared state (actionIds, leaderboard cache)
   - Use Redis Pub/Sub or message queue (RabbitMQ/Kafka) for cross-server WebSocket broadcasting
   - Database read replicas for leaderboard queries (if needed)
   - Consider CDN for static assets and API gateway for rate limiting

### Error Handling

- All errors return appropriate HTTP status codes
- Error messages should not expose internal system details
- Log all errors for monitoring and debugging

### Testing Requirements

1. **Unit Tests:**
   - Score update logic
   - Authorization checks
   - Input validation

2. **Integration Tests:**
   - API endpoints
   - Database operations
   - WebSocket events

3. **Load Tests:**
   - Concurrent score updates
   - WebSocket connection limits
   - Database query performance

## Improvements & Recommendations

### Short-term Improvements

1. **Add Score History:**
   - Track score changes over time
   - Enable score rollback if needed
   - Analytics on score patterns

2. **Enhanced Rate Limiting:**
   - Different limits for different user tiers
   - Adaptive rate limiting based on user behavior

3. **Score Validation Enhancements:**
   - Machine learning-based anomaly detection
   - Pattern recognition for suspicious activity

### Long-term Improvements

1. **Microservices Architecture:**
   - Separate score service from leaderboard service
   - Independent scaling of components
   - Better fault isolation

2. **Event Sourcing:**
   - Store all score events as immutable log
   - Enable replay and audit capabilities
   - Better for analytics

3. **Real-time Analytics:**
   - Track score trends
   - User engagement metrics
   - Leaderboard change frequency

4. **Multi-region Support:**
   - Global leaderboards
   - Regional leaderboards
   - Low-latency updates worldwide

5. **Advanced Features:**
   - Score multipliers/bonuses
   - Time-based leaderboards (daily/weekly/monthly)
   - Team/clan leaderboards
   - Score decay over time

### Security Enhancements

1. **Two-Factor Authentication:**
   - For high-value score updates
   - Optional for regular users

2. **Fraud Detection:**
   - Behavioral analysis
   - Device fingerprinting
   - IP-based checks

3. **Audit Logging:**
   - Log all score updates
   - Track suspicious patterns
   - Enable investigation capabilities

## Implementation Checklist

- [ ] Set up Express server with TypeScript
- [ ] Implement authentication middleware (JWT)
- [ ] Create score update endpoint
- [ ] Create leaderboard query endpoint
- [ ] Set up database (PostgreSQL/MySQL)
- [ ] Implement rate limiting
- [ ] Set up WebSocket server
- [ ] Implement broadcast logic
- [ ] Add input validation
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Set up monitoring and logging
- [ ] Create API documentation
- [ ] Deploy to staging environment

## Dependencies

### Required
- **Express.js** - Web framework for REST API
- **Socket.io or ws** - WebSocket/SSE server for real-time updates
- **jsonwebtoken** - JWT authentication
- **express-rate-limit** - Rate limiting middleware
- **PostgreSQL/MySQL** - Primary database for scores
- **Redis** - **Highly recommended** for ActionID deduplication and leaderboard caching (critical for performance and replay attack prevention)
- **TypeScript** - Type-safe development

### Optional (for advanced scaling)
- **RabbitMQ/Kafka** - Message queue for multi-server WebSocket broadcasting
- **ioredis** or **node-redis** - Redis client library

## Notes for Implementation Team

### Implementation Priority

1. **Phase 1: Core Functionality**
   - Set up Express server with TypeScript
   - Implement JWT authentication middleware
   - Create POST /api/score/increment endpoint with ActionID validation
   - Create GET /api/scores/leaderboard endpoint
   - Set up database with proper indexes

2. **Phase 2: Security & Validation**
   - Implement ActionID deduplication (Redis recommended)
   - Add rate limiting
   - Add comprehensive input validation
   - Implement authorization checks

3. **Phase 3: Real-time Updates**
   - Set up WebSocket/SSE server
   - Implement broadcast logic (only when top 10 changes)
   - Add client subscription handling

4. **Phase 4: Optimization**
   - Add Redis caching for leaderboard
   - Optimize database queries
   - Implement connection pooling

### Best Practices

1. **ActionID Implementation:**
   - Use Redis SET with expiration for actionId storage (better performance than database)
   - ActionID TTL: 5 minutes (adjust based on business requirements)
   - Generate ActionIDs on client side using UUID v4 or similar
   - Log all replay attack attempts for security monitoring

2. **Error Handling:**
   - Return appropriate HTTP status codes
   - Don't expose internal system details in error messages
   - Log all errors with context (userId, actionId, timestamp)

3. **Testing:**
   - Write tests alongside implementation (TDD recommended)
   - Test replay attack prevention (duplicate actionId)
   - Test concurrent score updates
   - Load test WebSocket connections

4. **Configuration:**
   - Use environment variables for all configuration
   - JWT secret, Redis connection, database connection, rate limits, etc.

5. **Documentation:**
   - Document all API endpoints with OpenAPI/Swagger
   - Include examples for WebSocket events
   - Document ActionID generation requirements for clients

6. **Scalability:**
   - Design for horizontal scaling from the start
   - Use Redis Pub/Sub or message queue (RabbitMQ/Kafka) for multi-server WebSocket broadcasting
   - Consider using API gateway for centralized rate limiting

