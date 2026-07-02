# Backend API Summary

Base URL: `/api/v1`

All responses follow:

```json
{ "success": true, "message": "Message", "data": {} }
```

Errors follow:

```json
{ "success": false, "message": "Message", "errors": [] }
```

## Auth

- `POST /auth/register`
- `POST /auth/verify-email`
- `POST /auth/resend-otp`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

## Tenant Profile

- `GET /tenant-profile/me`
- `PUT /tenant-profile/me`

## Listings

- `GET /listings`
- `GET /listings/matches`
- `GET /listings/:id`
- `POST /listings`
- `PATCH /listings/:id`
- `PATCH /listings/:id/filled`
- `DELETE /listings/:id`

## Compatibility

- `GET /compatibility/listings/:listingId`

## Interests

- `POST /interests/listings/:listingId`
- `GET /interests/tenant`
- `GET /interests/owner`
- `PATCH /interests/:id/accept`
- `PATCH /interests/:id/decline`

## Conversations

- `GET /conversations`
- `GET /conversations/:id`
- `GET /conversations/:id/messages`
- `PATCH /conversations/:id/read`

## Notifications

- `GET /notifications`
- `PATCH /notifications/:id/read`
- `PATCH /notifications/read-all`

## Admin

- `GET /admin/activity`
- `GET /admin/users`
- `PATCH /admin/users/:id/status`
- `GET /admin/listings`
- `PATCH /admin/listings/:id/status`

