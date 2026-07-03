# RoomCompanion

AI-powered rent and flatmate matching platform.

## Structure

```text
room-companion/
  backend/
  frontend/
  docs/
```

## Applications

- Backend: Express, MongoDB, Socket.IO, Cloudinary, Brevo, Gemini
- Frontend: React, Vite, Tailwind CSS, Socket.IO Client

## Local Development

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Deployment Targets

- Frontend: Vercel
- Backend: Hostinger
- Database: MongoDB Atlas
- Images: Cloudinary
- Email: Brevo

## Documentation

- Backend API: `docs/BACKEND_API.md`
- Database schema: `docs/DB_SCHEMA.md`
- System design: `docs/SYSTEM_DESIGN.md`
- LLM prompt: `docs/LLM_PROMPT.md`
- Deployment notes: `docs/DEPLOYMENT.md`
- Manual testing: `docs/MANUAL_TESTING.md`
