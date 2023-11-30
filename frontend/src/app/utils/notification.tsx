'use client';

import axios from 'axios';
import { useEffect } from 'react';

export function Notification({ session }: any) {
  useEffect(() => {
    if (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      session.user !== undefined
    ) {
      window.Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          navigator.serviceWorker
            .register('/service-worker.js')
            .then(async (registration) => {
              let subscription =
                await registration.pushManager.getSubscription();

              if (!subscription) {
                // Public Key
                const publicKeyResponse = await axios.get('/api/notification');

                subscription = await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: publicKeyResponse.data.publicKey,
                });
              }

              // Register
              await axios.post('/api/notification', subscription);
            });
        }
      });
    }
  }, []);

  return <div></div>;
}
