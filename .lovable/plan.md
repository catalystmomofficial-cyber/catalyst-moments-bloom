

## Push Notification Support Plan

### Overview
Add browser push notifications with a service worker, permission request UI, VAPID key integration, and proper Web Push protocol in the edge function. The `push_subscriptions` table already exists in Supabase.

### What You Need to Do First (Manual Step)
Generate VAPID keys for Web Push. You can use a free online tool or run `npx web-push generate-vapid-keys`. You will need to add the **private key** as a Supabase secret (`VAPID_PRIVATE_KEY`) and the **public key** will be stored in code (it is safe to expose publicly). You will also need a **VAPID subject** (your email, e.g. `mailto:catalystmom@outlook.com`).

---

### Implementation Steps

#### 1. Create Service Worker (`public/sw.js`)
- Listen for `push` events, parse notification data, and display via `self.registration.showNotification()`
- Listen for `notificationclick` to open the target URL
- Basic caching strategy is not needed here (this is purely for push)

#### 2. Create Push Notification Hook (`src/hooks/usePushNotifications.ts`)
- Register the service worker on mount
- Check current permission status (`Notification.permission`)
- Provide `requestPermission()` function that:
  1. Calls `Notification.requestPermission()`
  2. On grant, subscribes via `registration.pushManager.subscribe()` with the VAPID public key
  3. Saves the subscription (endpoint, p256dh, auth keys) to the `push_subscriptions` table via Supabase
- Provide `unsubscribe()` function to remove from table
- Expose `isSupported`, `permission`, `isSubscribed` state

#### 3. Create Permission Request UI (`src/components/notifications/PushNotificationPrompt.tsx`)
- A dismissible banner/card shown to authenticated users who haven't granted permission
- "Enable Notifications" button that calls `requestPermission()`
- Shows in Dashboard or as a toast-style prompt after login
- Stores dismissal in `localStorage` so it doesn't nag

#### 4. Update Edge Function (`supabase/functions/send-push-notifications/index.ts`)
- Replace the naive `fetch(endpoint)` with proper Web Push protocol using VAPID authentication
- Use the `web-push` library (via ESM import for Deno) or implement JWT-based VAPID signing manually
- Sign each push message with the VAPID private key so push services (FCM, Mozilla) accept it

#### 5. Add VAPID Secret
- Add `VAPID_PRIVATE_KEY` as a Supabase Edge Function secret
- Store the VAPID public key as a constant in the client code (safe to expose)

#### 6. Integrate into App
- Add service worker registration in `src/main.tsx`
- Show `PushNotificationPrompt` in the Dashboard page for logged-in users
- Wire the existing `NotificationSystem` bell icon to also show a "Turn on push notifications" option if not yet subscribed

### Files to Create/Modify

| File | Action |
|------|--------|
| `public/sw.js` | Create - Service worker for push events |
| `src/hooks/usePushNotifications.ts` | Create - Hook for permission + subscription management |
| `src/components/notifications/PushNotificationPrompt.tsx` | Create - Permission request UI |
| `supabase/functions/send-push-notifications/index.ts` | Update - Add VAPID signing |
| `src/main.tsx` | Update - Register service worker |
| `src/pages/Dashboard.tsx` | Update - Add push prompt |

### Technical Details
- VAPID public key stored as `VITE_VAPID_PUBLIC_KEY` in `.env` or hardcoded constant
- VAPID private key stored as Supabase secret `VAPID_PRIVATE_KEY`
- Service worker uses the Push API standard (`PushEvent`, `showNotification`)
- Subscription object keys (`p256dh`, `auth`) map to existing `push_subscriptions` table columns

