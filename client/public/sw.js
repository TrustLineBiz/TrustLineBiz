self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'TrustLine';
  const options = {
    body: data.body || '',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: data.data || {},
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const leadId = event.notification.data?.leadId;
  const url = leadId ? `/leads/${leadId}` : '/pipeline';
  event.waitUntil(clients.openWindow(url));
});
