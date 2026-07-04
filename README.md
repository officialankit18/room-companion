<div align="center">
  <img src="./frontend/public/brand/roomcompanion-logo.png" alt="RoomCompanion Logo" width="120" />

  <h1>RoomCompanion</h1>
  <p><strong>AI-Powered Room & Flatmate Finder</strong></p>
  <p>Better flatmates, better places, better living.</p>

  <p>
    <a href="https://roomcompanion-two.vercel.app">Live Frontend</a>
    ·
    <a href="https://dimgrey-herring-526627.hostingersite.com">Live Backend</a>
    ·
  </p>

  <p>
    <img alt="React" src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-0ea5e9?style=for-the-badge" />
    <img alt="Node" src="https://img.shields.io/badge/Backend-Node%20%2B%20Express-11157a?style=for-the-badge" />
    <img alt="MongoDB" src="https://img.shields.io/badge/Database-MongoDB%20Atlas-10b981?style=for-the-badge" />
    <img alt="Realtime" src="https://img.shields.io/badge/Realtime-Socket.IO-f01378?style=for-the-badge" />
  </p>
</div>

---

## Overview

**RoomCompanion** is a full-stack platform that helps tenants find compatible rooms and flatmates, while allowing owners to list rooms, receive tenant interest requests, and chat after approval.

The platform focuses on practical matching instead of random room browsing. Tenants create a profile with location, budget and move-in preferences. Owners create room listings with rent, room type, furnishing status, photos and address details. The backend calculates a compatibility score for every tenant-listing pair, ranks listings by the best match, and stores the score so it is not recomputed repeatedly.

## Live Links

| Item | Link |
| --- | --- |
| Frontend | https://roomcompanion-two.vercel.app |
| Backend | https://dimgrey-herring-526627.hostingersite.com |
| Main Repository | https://github.com/officialankit18/room-companion |
| Frontend-only Repository | https://github.com/officialankit18/roomcompanion |

## Key Features

| Module | Features |
| --- | --- |
| Authentication | Register, login, JWT auth, email OTP verification, resend OTP |
| Roles | Tenant, Owner and Admin access control |
| Tenant | Create profile, set budget/location, browse compatible listings, send interest |
| Owner | Create room listing, upload photos, manage requests, mark listing filled |
| AI Matching | Gemini compatibility score with explanation and rule-based fallback |
| Interest Workflow | Tenant sends request, owner accepts or declines, tenant gets notification |
| Chat | Socket.IO realtime chat after accepted interest, persisted messages |
| Notifications | OTP, high match interest, accept/decline updates, offline chat emails |
| Admin | Manage users, listings and platform activity |
| Location | OpenStreetMap/Nominatim location search and Google Maps links |

## System Architecture

![RoomCompanion System Architecture](./ARCHITECTURE.png)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router DOM |
| Forms | React Hook Form, Zod |
| API Client | Axios |
| Realtime | Socket.IO Client |
| Maps | Leaflet, React Leaflet, OpenStreetMap, Nominatim |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs, email OTP |
| Validation | express-validator |
| File Uploads | Multer, Cloudinary |
| AI | Gemini API with rule-based fallback |
| Email | Brevo |
| Deployment | Vercel frontend, Hostinger backend |

## Project Structure

```text
room-companion/
  backend/
    src/
      config/
      controllers/
      services/
      models/
      routes/
      middleware/
      validators/
      emails/
      sockets/
      utils/
      constants/
  frontend/
    public/
    src/
      api/
      auth/
      components/
      layouts/
      pages/
      routes/
      schemas/
      socket/
      styles/
  docs/
    BACKEND_API.md
    DB_SCHEMA.md
    DEPLOYMENT.md
    LLM_PROMPT.md
    MANUAL_TESTING.md
    SYSTEM_DESIGN.md
```

## Backend Architecture

The backend follows a clean MVC structure with a service layer.

| Layer | Responsibility |
| --- | --- |
| Routes | Define REST endpoints and attach middleware |
| Validators | Validate request body, params and query data |
| Controllers | Handle request/response flow |
| Services | Contain business logic and third-party integration logic |
| Models | Define MongoDB schemas using Mongoose |
| Middleware | Auth, role checks, validation, errors and request logging |
| Sockets | Socket.IO authentication, rooms and chat events |

## Database Schema

| Collection | Purpose | Important Fields |
| --- | --- | --- |
| `users` | Stores account and role data | name, email, passwordHash, role, isEmailVerified, isActive |
| `emailverifications` | Stores OTP verification data | userId, otpHash, expiresAt, attempts |
| `tenantprofiles` | Stores tenant preferences | userId, preferredCity, preferredLocality, minBudget, maxBudget, moveInDate |
| `listings` | Stores owner room listings | ownerId, title, rent, roomType, furnishingStatus, location, photos, status |
| `compatibilityscores` | Stores AI/rule match results | tenantId, listingId, score, explanation, source |
| `interests` | Stores tenant interest requests | tenantId, ownerId, listingId, status |
| `conversations` | Stores accepted chat rooms | tenantId, ownerId, listingId, interestId |
| `messages` | Stores chat messages | conversationId, senderId, body, status, readAt |
| `notifications` | Stores app notification events | userId, type, title, message, isRead |

### Important Indexes

| Collection | Index |
| --- | --- |
| `users` | unique email |
| `interests` | unique tenantId + listingId |
| `compatibilityscores` | unique tenantId + listingId |
| `conversations` | unique tenantId + ownerId + listingId |
| `messages` | conversationId + createdAt |
| `notifications` | userId + createdAt |

## Compatibility Scoring Design

RoomCompanion computes compatibility between a tenant profile and a room listing. The score ranges from **0 to 100** and is stored with a short explanation.

The scoring considers:

- Budget range vs listing rent
- City and locality match
- Move-in date and listing availability
- Room/listing suitability

Gemini receives structured listing and tenant data and returns:

```json
{
  "score": 94,
  "explanation": "The rent is within budget and the location strongly matches the tenant preference."
}
```

If Gemini fails, times out or returns invalid JSON, the backend uses a deterministic rule-based fallback. This keeps matching available even when the LLM service is unavailable.

## Realtime Chat Design

Chat is only unlocked after an owner accepts a tenant interest request.

1. Tenant sends interest for a listing.
2. Owner accepts the request.
3. Backend creates a conversation.
4. Tenant and owner join the conversation through Socket.IO.
5. Messages are saved in MongoDB before being emitted.
6. Users can still receive messages when offline and read them later.

The chat module supports persisted messages, online status, read/seen status and offline email alerts.

## Notification Flow

| Event | Notification |
| --- | --- |
| Register | OTP email using Brevo |
| High compatibility interest | Owner gets email with tenant details and score |
| Owner accepts request | Tenant gets accept email and chat unlocks |
| Owner declines request | Tenant gets decline email |
| Offline message | Receiver gets email alert |

## API Summary

Base URL:

```text
https://dimgrey-herring-526627.hostingersite.com/api/v1
```

### Response Format

```json
{
  "success": true,
  "message": "Request completed",
  "data": {}
}
```

### Core Endpoints

| Module | Endpoint | Description |
| --- | --- | --- |
| Auth | `POST /auth/register` | Create user account |
| Auth | `POST /auth/verify-email` | Verify email OTP |
| Auth | `POST /auth/resend-otp` | Resend verification OTP |
| Auth | `POST /auth/login` | Login and receive JWT |
| Auth | `GET /auth/me` | Get current logged-in user |
| Tenant Profile | `GET /tenant-profile/me` | Get tenant profile |
| Tenant Profile | `PUT /tenant-profile/me` | Update tenant preferences |
| Listings | `GET /listings` | Browse active listings |
| Listings | `GET /listings/matches` | Ranked compatible listings |
| Listings | `POST /listings` | Owner creates listing |
| Listings | `PATCH /listings/:id` | Owner updates listing |
| Listings | `PATCH /listings/:id/filled` | Mark listing filled |
| Compatibility | `GET /compatibility/listings/:listingId` | Get tenant-listing score |
| Interests | `POST /interests/listings/:listingId` | Tenant sends interest |
| Interests | `GET /interests/tenant` | Tenant interest history |
| Interests | `GET /interests/owner` | Owner received requests |
| Interests | `PATCH /interests/:id/accept` | Accept interest |
| Interests | `PATCH /interests/:id/decline` | Decline interest |
| Conversations | `GET /conversations` | List conversations |
| Conversations | `GET /conversations/:id/messages` | Get persisted messages |
| Conversations | `PATCH /conversations/:id/read` | Mark messages read |
| Notifications | `GET /notifications` | Get notifications |
| Admin | `GET /admin/activity` | View platform activity |
| Admin | `GET /admin/users` | Manage users |
| Admin | `GET /admin/listings` | Manage listings |

## Environment Variables

### Backend `.env`

```env
NODE_ENV=production
PORT=5000

FRONTEND_URLS=https://roomcompanion-two.vercel.app
BACKEND_URL=https://dimgrey-herring-526627.hostingersite.com

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/room_companion

JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d

BREVO_API_KEY=replace_with_brevo_key
BREVO_SENDER_EMAIL=your_sender_email
BREVO_SENDER_NAME=RoomCompanion

CLOUDINARY_CLOUD_NAME=replace_with_cloud_name
CLOUDINARY_API_KEY=replace_with_api_key
CLOUDINARY_API_SECRET=replace_with_api_secret

GEMINI_API_KEY=replace_with_gemini_key

NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
NOMINATIM_USER_AGENT=RoomCompanion/1.0
```

### Frontend `.env`

```env
VITE_API_BASE_URL=https://dimgrey-herring-526627.hostingersite.com/api/v1
VITE_SOCKET_URL=https://dimgrey-herring-526627.hostingersite.com
```

## Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend health check:

```text
GET http://localhost:5000/
```

Expected response:

```json
{
  "success": true,
  "message": "RoomCompanion Backend Running"
}
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Deployment

| Component | Platform | Notes |
| --- | --- | --- |
| Frontend | Vercel | Connect frontend-only repo and set Vite env variables |
| Backend | Hostinger | Upload backend files, create `.env`, install dependencies and restart |
| Database | MongoDB Atlas | Use Atlas connection string in `MONGO_URI` |
| Images | Cloudinary | Owner listing photos are stored here |
| Email | Brevo | OTP, interest and chat notification emails |

## Manual Testing Flow

| Flow | Steps |
| --- | --- |
| Auth | Register user, verify OTP, login, check JWT-protected dashboard |
| Tenant Profile | Login as tenant, update city, budget and move-in date |
| Owner Listing | Login as owner, create listing, upload photo, select location |
| Matching | Login as tenant, open matches, verify ranked compatibility scores |
| Interest | Tenant sends interest, owner receives request, owner accepts/declines |
| Chat | After acceptance, tenant and owner exchange realtime messages |
| Notification | Check Brevo emails and in-app notification list |
| Admin | Login as admin, manage users/listings and view activity |

## Documentation

| File | Description |
| --- | --- |
| `docs/BACKEND_API.md` | API endpoint summary |
| `docs/DB_SCHEMA.md` | Database collections and indexes |
| `docs/SYSTEM_DESIGN.md` | Backend system design |
| `docs/LLM_PROMPT.md` | Gemini scoring prompt |
| `docs/DEPLOYMENT.md` | Deployment guide |
| `docs/MANUAL_TESTING.md` | Manual testing checklist |

## Security Notes

- Passwords are hashed using bcrypt.
- JWT is required for protected APIs.
- Role-based authorization protects tenant, owner and admin routes.
- Environment variables are never committed.
- Cloudinary stores photos; MongoDB stores references.
- CORS is configured for the deployed frontend and local development origins.

## Author

**Ankit Yadav**  
GitHub: [officialankit18](https://github.com/officialankit18)

---

<div align="center">
  <strong>RoomCompanion</strong> — Find the right room. Meet the right roommate.
</div>
