# RoomCompanion Backend

Production-style Express API for an AI-powered rent and flatmate matching platform.

## Stack

- Node.js, Express.js
- MongoDB Atlas, Mongoose
- JWT authentication, bcrypt password hashing
- Brevo email
- Cloudinary image upload
- Gemini 2.5 Flash compatibility scoring with rule-based fallback
- Socket.IO realtime chat

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Required `.env` values are listed in `.env.example`.

## Scripts

```bash
npm run dev
npm start
npm run seed
```

## Health Check

```http
GET /
```

## Main API Groups

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/verify-email`
- `POST /api/v1/auth/resend-otp`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/listings`
- `POST /api/v1/listings`
- `GET /api/v1/listings/matches`
- `GET /api/v1/compatibility/listings/:listingId`
- `PUT /api/v1/tenant-profile/me`
- `POST /api/v1/interests/listings/:listingId`
- `PATCH /api/v1/interests/:id/accept`
- `PATCH /api/v1/interests/:id/decline`
- `GET /api/v1/conversations`
- `GET /api/v1/conversations/:id/messages`
- `GET /api/v1/notifications`
- `GET /api/v1/admin/activity`

## Socket Events

- `joinConversation`
- `leaveConversation`
- `typing`
- `stopTyping`
- `sendMessage`
- `messageDelivered`
- `messageRead`

Socket connections must send JWT as `auth.token`.

