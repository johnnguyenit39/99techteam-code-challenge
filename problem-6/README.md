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

This module implements a real-time scoreboard system that displays the top 10 users' scores with live updates. The system includes score update endpoints, authentication/authorization mechanisms, and a WebSocket-based live update system.

### Architecture Diagram

See [`diagram/architecture.md`](./diagram/architecture.md) for detailed architecture diagrams.

### Core Components

#### 1. Score Update API
- **Endpoint:** `POST /api/scores/update`
- **Purpose:** Receive score updates from client actions
- **Authentication:** Required (JWT token)
- **Authorization:** User can only update their own score

#### 2. Scoreboard Query API
- **Endpoint:** `GET /api/scores/leaderboard`
- **Purpose:** Retrieve top 10 scores
- **Authentication:** Optional (public leaderboard)
- **Response:** Array of top 10 user scores

#### 3. WebSocket Server
- **Purpose:** Push live updates to connected clients
- **Events:**
  - `score_updated`: Broadcast when a score is updated
  - `leaderboard_updated`: Broadcast when leaderboard changes

#### 4. Authentication & Authorization
- **JWT-based authentication**
- **Rate limiting** to prevent abuse
- **Score validation** to prevent invalid updates

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

#### Score Update Request
```typescript
interface ScoreUpdateRequest {
  userId: string;
  scoreIncrement: number; // Positive integer
}
```

### API Endpoints

#### POST /api/scores/update
Update a user's score.

**Request:**
```json
{
  "userId": "user123",
  "scoreIncrement": 10
}
```

**Response:**
```json
{
  "success": true,
  "newScore": 150,
  "rank": 5
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User trying to update another user's score
- `400 Bad Request`: Invalid score increment
- `429 Too Many Requests`: Rate limit exceeded

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

### WebSocket Events

#### Client → Server

**Subscribe to leaderboard updates:**
```json
{
  "event": "subscribe",
  "channel": "leaderboard"
}
```

#### Server → Client

**Score updated:**
```json
{
  "event": "score_updated",
  "data": {
    "userId": "user123",
    "newScore": 150,
    "rank": 5
  }
}
```

**Leaderboard updated:**
```json
{
  "event": "leaderboard_updated",
  "data": {
    "leaderboard": [/* top 10 scores */],
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### Security Considerations

1. **Authentication:**
   - All score update requests require valid JWT token
   - Token must include user ID claim

2. **Authorization:**
   - Users can only update their own scores
   - Validate `userId` in token matches request body

3. **Rate Limiting:**
   - Limit score updates per user (e.g., 100 updates per minute)
   - Use token bucket or sliding window algorithm

4. **Input Validation:**
   - Validate `scoreIncrement` is positive integer
   - Validate `scoreIncrement` is within reasonable bounds (e.g., 1-1000)
   - Sanitize all inputs

5. **Score Validation:**
   - Prevent negative scores
   - Prevent unrealistic score jumps (detect anomalies)

### Database Schema

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

### Implementation Flow

1. **Score Update Flow:**
   ```
   Client Action → POST /api/scores/update
   → Authenticate & Authorize
   → Validate Input
   → Check Rate Limit
   → Update Database
   → Check if Top 10 Changed
   → Broadcast via WebSocket
   → Return Response
   ```

2. **Leaderboard Query Flow:**
   ```
   Client → GET /api/scores/leaderboard
   → Query Database (Top 10)
   → Return Results
   ```

3. **Live Update Flow:**
   ```
   Score Updated → Check if Top 10 Changed
   → If Changed: Broadcast to WebSocket Clients
   → Clients Update UI
   ```

### Performance Considerations

1. **Database Indexing:**
   - Index on `score` (DESC) for efficient top 10 queries
   - Index on `user_id` for user lookups

2. **Caching:**
   - Cache top 10 leaderboard (Redis) with 1-5 second TTL
   - Invalidate cache on score updates

3. **WebSocket Optimization:**
   - Only broadcast if top 10 actually changed
   - Use connection pooling for WebSocket connections

4. **Query Optimization:**
   - Use `LIMIT 10` with `ORDER BY score DESC`
   - Consider materialized views for very high traffic

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

- Express.js (Web framework)
- Socket.io or ws (WebSocket)
- jsonwebtoken (JWT authentication)
- express-rate-limit (Rate limiting)
- PostgreSQL/MySQL (Database)
- Redis (Caching, optional)
- TypeScript (Language)

## Notes for Implementation Team

1. Start with basic CRUD operations, then add WebSocket functionality
2. Implement comprehensive logging from the beginning
3. Use environment variables for all configuration
4. Follow RESTful API conventions
5. Write tests alongside implementation (TDD recommended)
6. Document all API endpoints with OpenAPI/Swagger
7. Consider using a message queue (RabbitMQ/Kafka) for high-scale scenarios

