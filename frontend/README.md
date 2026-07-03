# RoomCompanion Frontend

React + Vite frontend for RoomCompanion.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Router
- React Hook Form + Zod
- Axios
- Socket.IO Client
- Lucide React
- React Hot Toast

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

For Vercel, set these same variables in Project Settings > Environment Variables.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Vercel

Use these settings when importing the repository:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

`vercel.json` includes an SPA rewrite so direct visits to dashboard routes still load the React app.
