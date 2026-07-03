# Manual Testing Guide

Use this flow after backend and frontend are running.

## 1. Local Startup

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open the frontend URL shown by Vite.

## 2. Health Check

- Open `http://localhost:5000/`
- Expected: `RoomCompanion Backend Running`

## 3. Authentication

Create three accounts:

- Tenant
- Owner
- Admin

Test:

- Register with name, email, password, role
- Verify email using OTP from Brevo inbox
- Login
- Logout
- Login again
- Try accessing a protected dashboard without login

Expected:

- Unverified users see email verification flow
- JWT session persists after refresh
- Tenant cannot open owner/admin routes
- Owner cannot open tenant/admin routes

## 4. Owner Listing Flow

Login as owner.

Test:

- Open owner listings page
- Create a listing with city, locality, rent, room type, furnishing, date, description, and images
- Confirm image upload works
- Confirm listing appears in owner list
- Mark listing filled
- Confirm filled listing is hidden from tenant search

Recommended cities:

- Bangalore
- Hyderabad
- Pune
- Delhi
- Noida
- Gurgaon

Expected:

- Images are uploaded to Cloudinary
- Listing data is saved in MongoDB
- Only the owner can modify their own listings

## 5. Tenant Profile And Matches

Login as tenant.

Test:

- Create tenant profile with preferred city, locality, budget, move-in date, and room type
- Open matches page
- Apply filters by city, rent, and room type
- Check ranked listing order

Expected:

- Highest compatibility score appears first
- Score explanation is visible
- Compatibility is stored and reused
- If Gemini fails, rule-based score still appears

## 6. Interest Workflow

As tenant:

- Send interest on a matched listing
- Confirm duplicate interest is blocked

As owner:

- Open requests page
- Accept one request
- Decline another request

Expected:

- Owner receives email for high compatibility interest
- Tenant receives email on accept/decline
- Accepted request creates a conversation
- Declined request does not create a conversation

## 7. Realtime Chat

Use two browsers or one normal window plus one incognito window.

Test:

- Login as tenant in one browser
- Login as owner in another browser
- Open chat after accepted interest
- Send messages both ways
- Check typing indicator
- Check read status
- Refresh page and confirm messages persist

Expected:

- Messages are realtime through Socket.IO
- Messages are saved in MongoDB
- Offline user receives email notification for new message

## 8. Notifications

Test these triggers:

- New interest
- High AI match
- Accepted request
- Declined request
- New message

Expected:

- Notification bell count updates
- Notification list shows events
- Mark all read works

## 9. Admin

Login as admin.

Test:

- View platform activity
- Search users
- Filter users by role
- Activate/deactivate user
- Search listings
- Filter listings by status
- Change listing status

Expected:

- Admin can manage users and listings
- Non-admin users cannot access admin APIs/pages

## 10. Production Smoke Test

After deployment:

- Backend root URL opens successfully
- Frontend opens on Vercel
- Register/login works on deployed app
- Frontend API calls use deployed backend URL
- Socket chat connects to deployed backend URL
- Uploaded images appear from Cloudinary
- Emails arrive from Brevo

## Common Issues

- MongoDB connection fails: check Atlas network access and `MONGODB_URI`
- Emails do not arrive: verify Brevo sender and API key
- Images do not upload: check Cloudinary credentials
- AI score missing: check Gemini key; fallback should still return a score
- Vercel route refresh gives 404: confirm `frontend/vercel.json` is deployed
