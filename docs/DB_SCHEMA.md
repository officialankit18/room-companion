# Database Schema

Collections:

- `users`: identity, auth, role, verification, active status
- `emailverifications`: hashed OTP, expiry, attempt count
- `tenantprofiles`: preferred location, budget, move-in date
- `listings`: owner room listing, rent, location, status, Cloudinary image URLs
- `compatibilityscores`: tenant-listing score, explanation, source
- `interests`: tenant interest request with pending/accepted/declined status
- `conversations`: accepted owner-tenant-listing chat container
- `messages`: persisted chat messages
- `notifications`: in-app notification center

Important indexes:

- `users.email` unique
- `interests.tenantId + listingId` unique
- `compatibilityscores.tenantId + listingId` unique
- `conversations.tenantId + ownerId + listingId` unique
- `messages.conversationId + createdAt`
- `notifications.userId + createdAt`

