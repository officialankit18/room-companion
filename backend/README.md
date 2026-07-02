# RoomCompanion Backend

Production-style Express backend for RoomCompanion.

## Scripts

```bash
npm run dev
npm start
```

## Health Check

```http
GET /
```

Expected response:

```json
{
  "success": true,
  "message": "RoomCompanion Backend Running",
  "data": {
    "service": "room-companion-backend"
  }
}
```

