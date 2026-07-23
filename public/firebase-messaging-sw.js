// Firebase Cloud Messaging Service Worker
//
// This file is served as-is from /public — Vite does not process it, so
// `import.meta.env.*` (which only works inside the bundled app) can never be
// resolved here, and registering this worker with that syntax fails as a
// parse error every time. Instead, the config is passed as URL query params
// when the app registers this worker (see usePushNotifications.ts), and read
// back out of self.location.search below.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const params = new URLSearchParams(self.location.search);

firebase.initializeApp({
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
  storageBucket: params.get('storageBucket'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
  measurementId: params.get('measurementId'),
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  const data = payload.data || {};
  const title = n.title || data.title || 'Catalyst Mom';
  const options = {
    body: n.body || data.body || '',
    icon: n.icon || data.icon || '/catalyst-mom-logo.png',
    badge: '/catalyst-mom-logo.png',
    data: { url: data.url || '/' },
    vibrate: [100, 50, 100],
    tag: data.tag || 'catalyst-mom-notification',
    renotify: true,
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
