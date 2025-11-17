# Architecture Diagrams

## System Overview

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTP/WebSocket
       │
┌──────▼─────────────────────────────────────┐
│         Express API Server                 │
│  ┌──────────────────────────────────────┐  │
│  │  Authentication Middleware (JWT)     │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Rate Limiting Middleware            │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Score Update Controller             │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  Leaderboard Controller              │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  WebSocket Server                    │  │
│  └──────────────────────────────────────┘  │
└──────┬─────────────────────────────────────┘
       │
       │
┌──────▼──────┐         ┌──────────────┐
│  Database   │         │    Redis     │
│ (PostgreSQL)│         │   (Cache)    │
└─────────────┘         └──────────────┘
```

## Score Update Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ POST /api/scores/update
     │ { userId, scoreIncrement }
     │
┌────▼─────────────────────────────────────┐
│ 1. Authentication Middleware             │
│    - Validate JWT Token                  │
│    - Extract userId from token           │
└────┬─────────────────────────────────────┘
     │
┌────▼─────────────────────────────────────┐
│ 2. Authorization Check                   │
│    - Verify userId matches token         │
│    - Check if user can update score      │
└────┬─────────────────────────────────────┘
     │
┌────▼─────────────────────────────────────┐
│ 3. Rate Limiting                         │
│    - Check user's request count          │
│    - Reject if limit exceeded            │
└────┬─────────────────────────────────────┘
     │
┌────▼─────────────────────────────────────┐
│ 4. Input Validation                      │
│    - Validate scoreIncrement             │
│    - Check bounds (1-1000)               │
└────┬─────────────────────────────────────┘
     │
┌────▼─────────────────────────────────────┐
│ 5. Update Database                       │
│    - Get current score                   │
│    - Calculate new score                 │
│    - Update in database                  │
└────┬─────────────────────────────────────┘
     │
┌────▼─────────────────────────────────────┐
│ 6. Check Leaderboard Change              │
│    - Query top 10                        │
│    - Compare with cached top 10          │
│    - Determine if changed                │
└────┬─────────────────────────────────────┘
     │
     ├─ Changed? ──YES──┐
     │                  │
     NO                 │
     │                  │
┌────▼──────┐    ┌──────▼──────────────────┐
│ 7a. Return│    │ 7b. Broadcast Update    │
│ Response  │    │     - WebSocket Event    │
│           │    │     - Update Cache       │
└───────────┘    └─────────────────────────┘
```

## WebSocket Live Update Flow

```
┌─────────┐                    ┌──────────────┐
│ Client  │                    │ API Server   │
└────┬────┘                    └──────┬───────┘
     │                                │
     │ WebSocket Connection           │
     │───────────────────────────────>│
     │                                │
     │ Subscribe to leaderboard       │
     │───────────────────────────────>│
     │                                │
     │                                │ Score Updated
     │                                │──────────────┐
     │                                │              │
     │                                │<─────────────┘
     │                                │
     │                                │ Check Top 10
     │                                │ Changed?
     │                                │
     │                                │ YES
     │                                │
     │ leaderboard_updated            │
     │<───────────────────────────────│
     │                                │
     │ Update UI                      │
     │                                │
```

## Database Schema

```
┌─────────────────┐
│     scores       │
├─────────────────┤
│ id (UUID) PK     │
│ user_id (VARCHAR)│─── UNIQUE
│ username (VARCHAR)│
│ score (INTEGER)  │─── INDEX (DESC)
│ updated_at       │
│ created_at       │
└─────────────────┘
```

## Component Interaction

```
┌──────────────┐
│   Routes     │
└──────┬───────┘
       │
       ├──────────────┐
       │              │
┌──────▼──────┐  ┌────▼──────────┐
│ Controllers │  │  Middleware   │
└──────┬──────┘  └───────────────┘
       │
       │
┌──────▼──────┐
│  Services   │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
┌──────▼──────┐  ┌────▼──────────┐
│  Database   │  │    Cache      │
│  (Postgres) │  │   (Redis)     │
└─────────────┘  └───────────────┘
```

## Sequence Diagram: Score Update

```
Client          API Server        Database        WebSocket        Other Clients
  │                 │                 │               │                 │
  │ POST /update    │                 │               │                 │
  │────────────────>│                 │               │                 │
  │                 │                 │               │                 │
  │                 │ Authenticate    │               │                 │
  │                 │─────────────────┼───────────────┼─────────────────┤
  │                 │                 │               │                 │
  │                 │ Update Score    │               │                 │
  │                 │────────────────>│               │                 │
  │                 │                 │               │                 │
  │                 │<────────────────│               │                 │
  │                 │                 │               │                 │
  │                 │ Check Top 10    │               │                 │
  │                 │────────────────>│               │                 │
  │                 │                 │               │                 │
  │                 │<────────────────│               │                 │
  │                 │                 │               │                 │
  │                 │                 │ Broadcast     │                 │
  │                 │                 │──────────────>│                 │
  │                 │                 │               │                 │
  │                 │                 │               │ Push Update     │
  │                 │                 │               │────────────────>│
  │                 │                 │               │                 │
  │<────────────────│                 │               │                 │
  │ 200 OK          │                 │               │                 │
```

