// Service Worker for Push Notifications

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.message || 'You have a new notification',
      icon: '/catalyst-mom-logo.png',
      badge: '/catalyst-mom-logo.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.action_url || '/',
        ...data
      },
      actions: [
        {
          action: 'open',
          title: 'Open App'
        },
        {
          action: 'close',
          title: 'Close'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Catalyst Mom', options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const url = event.notification.data.url || '/';
    
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  // Handle notification close
  console.log('Notification closed');
});