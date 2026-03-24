// Catalyst Mom Push Notification Service Worker

self.addEventListener('push', (event) => {
  let data = { title: 'Catalyst Mom', body: 'You have a new notification!' };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.error('Failed to parse push data:', e);
  }

  const options = {
    body: data.body || data.message || '',
    icon: data.icon || '/catalyst-mom-logo.png',
    badge: data.badge || '/catalyst-mom-logo.png',
    data: { url: data.url || '/' },
    vibrate: [100, 50, 100],
    actions: data.actions || [],
    tag: data.tag || 'catalyst-mom-notification',
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Catalyst Mom', options)
  );
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
