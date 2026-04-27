// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBWanXNXNO8ROsndyUaOr1tYUwNHWWT7es',
  authDomain: 'catalyst-mom-app.firebaseapp.com',
  projectId: 'catalyst-mom-app',
  storageBucket: 'catalyst-mom-app.firebasestorage.app',
  messagingSenderId: '99975504315',
  appId: '1:99975504315:web:c166abb3dfc50a46f6e49e',
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
