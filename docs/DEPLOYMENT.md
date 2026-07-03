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

## Frontend: Vercel

1. Import the GitHub repository in Vercel.
2. Use `frontend` as the root directory.
3. Set build settings:

```text
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

4. Add environment variables:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
VITE_SOCKET_URL=https://your-backend-domain.com
```

5. Deploy.

The frontend includes `vercel.json` so dashboard routes work on page refresh.

## External Services

- MongoDB Atlas for database
- Cloudinary for listing images
- Brevo for transactional emails
- Gemini for AI compatibility scoring

## Final Checks

- Backend root URL returns the health message.
- Frontend login and register pages open.
- Tenant, owner, and admin dashboards are protected.
- Listing image uploads work.
- Email OTP and interest notifications arrive.
- Chat connects through Socket.IO.
