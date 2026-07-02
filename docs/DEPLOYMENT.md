# Deployment Notes

## Backend: Hostinger

1. Upload/pull repository on Hostinger.
2. Go to `backend`.
3. Install dependencies:

```bash
npm install
```

4. Add production `.env` values.
5. Start backend:

```bash
npm start
```

Use Hostinger Node.js app panel or process manager according to the hosting plan.

## Frontend

Frontend will be deployed later on Vercel.

## External Services

- MongoDB Atlas for database
- Cloudinary for listing images
- Brevo for transactional emails
- Gemini for AI compatibility scoring

