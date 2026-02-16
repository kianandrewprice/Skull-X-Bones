# Skull x Bones - API Documentation

Base URL: `https://api.skullxbones.com/api/v1`

All API requests must include appropriate headers and authentication where required.

## Authentication

### Register
Create a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "cooluser",
  "displayName": "Cool User"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "cooluser",
      "displayName": "Cool User",
      "role": "user"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Login
Authenticate existing user.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### Refresh Token
Get a new access token using refresh token.

**Endpoint**: `POST /auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "refresh_token"
}
```

## Music Platform API

### Get Songs
Retrieve a list of songs with optional filters.

**Endpoint**: `GET /music/songs`

**Query Parameters**:
- `genre`: Filter by genre
- `artistId`: Filter by artist
- `search`: Search by title or artist name
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Song Title",
      "artistId": "uuid",
      "artistName": "Artist Name",
      "duration": 240,
      "genre": ["rock", "alternative"],
      "coverArt": "https://cdn.example.com/cover.jpg",
      "plays": 1500,
      "likes": 200,
      "rankingPoints": 3400
    }
  ]
}
```

### Get Music Rankings
Retrieve current music rankings.

**Endpoint**: `GET /music/rankings`

**Query Parameters**:
- `category`: overall | genre | new | trending
- `period`: daily | weekly | monthly | allTime
- `genre`: Specific genre (if category=genre)
- `limit`: Number of results

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "previousRank": 2,
      "songId": "uuid",
      "points": 15000,
      "song": { /* song object */ }
    }
  ]
}
```

### Get Current Radio Song
Get the song currently playing on the radio.

**Endpoint**: `GET /music/radio/current`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "songId": "uuid",
    "position": 5,
    "playedAt": "2026-02-16T14:00:00Z",
    "rotation": "heavy",
    "status": "playing",
    "song": { /* song object */ }
  }
}
```

### Upload Song
Upload a new song (requires artist verification).

**Endpoint**: `POST /music/songs`
**Authentication**: Required (Artist)

**Request Body**:
```json
{
  "title": "My New Song",
  "duration": 180,
  "genre": ["pop", "electronic"],
  "audioUrl": "https://cdn.example.com/song.mp3",
  "coverArt": "https://cdn.example.com/cover.jpg"
}
```

### Vote in Song War
Cast a vote in an active song war.

**Endpoint**: `POST /music/song-wars/:id/vote`
**Authentication**: Required

**Request Body**:
```json
{
  "songId": "uuid"
}
```

## Esports Platform API

### Get Tournaments
List all tournaments with filters.

**Endpoint**: `GET /esports/tournaments`

**Query Parameters**:
- `game`: Filter by game
- `status`: registration | ongoing | completed
- `limit`: Number of results
- `offset`: Pagination offset

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Spring Championship",
      "game": "League of Legends",
      "format": "single_elimination",
      "maxTeams": 32,
      "prizePool": 10000,
      "startDate": "2026-03-01T00:00:00Z",
      "status": "registration",
      "participants": 12
    }
  ]
}
```

### Create Tournament
Create a new tournament.

**Endpoint**: `POST /esports/tournaments`
**Authentication**: Required

**Request Body**:
```json
{
  "name": "Tournament Name",
  "game": "Game Name",
  "format": "single_elimination",
  "maxTeams": 16,
  "prizePool": 5000,
  "startDate": "2026-03-15T00:00:00Z",
  "endDate": "2026-03-20T00:00:00Z",
  "registrationDeadline": "2026-03-10T00:00:00Z"
}
```

### Get Leaderboard
Retrieve game-specific leaderboard.

**Endpoint**: `GET /esports/leaderboards/:game`

**Query Parameters**:
- `period`: daily | weekly | monthly | season | allTime

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "game": "Valorant",
    "period": "monthly",
    "entries": [
      {
        "rank": 1,
        "previousRank": 1,
        "teamId": "uuid",
        "teamName": "Team Awesome",
        "points": 2500,
        "wins": 25,
        "losses": 5
      }
    ]
  }
}
```

## Marketplace API

### Get Products
Browse marketplace products.

**Endpoint**: `GET /marketplace/products`

**Query Parameters**:
- `category`: merchandise | digital | music | tickets
- `vendorId`: Filter by vendor
- `vendorType`: artist | team | label | collective
- `search`: Search query
- `minPrice`: Minimum price
- `maxPrice`: Maximum price

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "vendorId": "uuid",
      "vendorType": "artist",
      "name": "Band T-Shirt",
      "description": "Official band merchandise",
      "category": "merchandise",
      "price": 29.99,
      "currency": "USD",
      "stock": 100,
      "images": ["url1", "url2"]
    }
  ]
}
```

### Get Cart
Retrieve user's shopping cart.

**Endpoint**: `GET /marketplace/cart`
**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "items": [
      {
        "productId": "uuid",
        "quantity": 2,
        "product": { /* product object */ }
      }
    ]
  }
}
```

### Create Order
Place an order from cart.

**Endpoint**: `POST /marketplace/orders`
**Authentication**: Required

**Request Body**:
```json
{
  "items": [
    {
      "productId": "uuid",
      "variantId": "uuid",
      "quantity": 1,
      "price": 29.99
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "stripe"
}
```

## Ticketing API

### Get Events
List all events.

**Endpoint**: `GET /ticketing/events`

**Query Parameters**:
- `type`: concert | tournament | stream | meet_and_greet
- `startDate`: Filter events after date
- `status`: published | ongoing | completed

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Summer Music Festival",
      "description": "Annual music festival",
      "type": "concert",
      "startDate": "2026-07-15T18:00:00Z",
      "endDate": "2026-07-17T23:00:00Z",
      "venue": {
        "name": "Central Park",
        "city": "New York",
        "state": "NY"
      },
      "capacity": 5000,
      "ticketsSold": 2300
    }
  ]
}
```

### Purchase Tickets
Buy tickets for an event.

**Endpoint**: `POST /ticketing/orders`
**Authentication**: Required

**Request Body**:
```json
{
  "eventId": "uuid",
  "ticketTypeId": "uuid",
  "quantity": 2,
  "paymentMethod": "stripe"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "TKT-1234567890",
    "eventId": "uuid",
    "tickets": ["ticket-uuid-1", "ticket-uuid-2"],
    "total": 150.00,
    "paymentStatus": "paid"
  }
}
```

## Streaming API

### Get Live Streams
Get currently live streams.

**Endpoint**: `GET /streaming/live`

**Query Parameters**:
- `category`: music | gaming | tournament
- `limit`: Number of results

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "streamerName": "DJ Awesome",
      "title": "Live Mix Session",
      "category": "music",
      "status": "live",
      "viewerCount": 1500,
      "thumbnail": "url",
      "streamUrl": "url"
    }
  ]
}
```

### Get VODs
Browse video-on-demand library.

**Endpoint**: `GET /streaming/vods`

**Query Parameters**:
- `category`: Filter by category
- `uploaderId`: Filter by uploader
- `search`: Search query

### Create Stream
Schedule or start a stream.

**Endpoint**: `POST /streaming/streams`
**Authentication**: Required

**Request Body**:
```json
{
  "title": "My Live Stream",
  "description": "Stream description",
  "category": "music",
  "platforms": [
    {
      "platform": "twitch",
      "isActive": true
    }
  ],
  "isRecorded": true
}
```

## Forums API

### Get Forums
List all forums.

**Endpoint**: `GET /forums`

**Query Parameters**:
- `category`: general | music | esports | support | official

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "General Discussion",
      "slug": "general-discussion",
      "description": "Talk about anything",
      "category": "general",
      "threadCount": 1500,
      "postCount": 25000
    }
  ]
}
```

### Create Thread
Start a new discussion thread.

**Endpoint**: `POST /forums/:forumId/threads`
**Authentication**: Required

**Request Body**:
```json
{
  "title": "Thread Title",
  "content": "Thread content goes here",
  "tags": ["discussion", "question"]
}
```

### Create Post
Reply to a thread.

**Endpoint**: `POST /forums/threads/:threadId/posts`
**Authentication**: Required

**Request Body**:
```json
{
  "content": "Post content",
  "parentPostId": "uuid" // optional, for nested replies
}
```

### Get User Reputation
Get user's forum reputation and badges.

**Endpoint**: `GET /forums/users/:userId/reputation`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "points": 1500,
    "level": 5,
    "badges": [
      {
        "id": "uuid",
        "name": "Helpful Member",
        "icon": "url",
        "earnedAt": "2026-01-15T00:00:00Z"
      }
    ],
    "postCount": 250,
    "threadCount": 30,
    "likesReceived": 450
  }
}
```

## User API

### Get Current User
Get authenticated user's profile.

**Endpoint**: `GET /users/me`
**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "cooluser",
    "displayName": "Cool User",
    "bio": "User bio",
    "avatar": "url",
    "role": "user",
    "verificationType": "artist",
    "verificationStatus": "verified",
    "reputation": 1500
  }
}
```

### Update Profile
Update user profile information.

**Endpoint**: `PUT /users/me`
**Authentication**: Required

**Request Body**:
```json
{
  "displayName": "New Display Name",
  "bio": "Updated bio",
  "avatar": "new-avatar-url"
}
```

### Request Verification
Request account verification.

**Endpoint**: `POST /users/verification/request`
**Authentication**: Required

**Request Body**:
```json
{
  "verificationType": "artist",
  "documents": ["url1", "url2"],
  "additionalInfo": "Additional verification info"
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

### Common HTTP Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Authenticated**: 1000 requests per 15 minutes per user
- Rate limit info included in response headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Webhooks

### Stripe Webhook
Endpoint for Stripe payment events.

**Endpoint**: `POST /webhooks/stripe`

Handles events:
- `payment_intent.succeeded`
- `payment_intent.failed`
- `charge.refunded`

---

For more information, visit [API Documentation Portal](https://docs.skullxbones.com)
