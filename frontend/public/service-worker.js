//
self.addEventListener('push', function (event) {

  const body = event.data?.text() ?? '';

  event.waitUntil(
    self.registration.showNotification('Microrota', {
      body,
      icon: './icons/icon-192x192.png'
    })
  );
});