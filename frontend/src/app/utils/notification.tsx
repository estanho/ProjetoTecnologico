'use client'

import axios from "axios";
import { useEffect } from "react";

export function Notification({ session }: any) {

  useEffect(()=> {
    if ('navigator' in window && session.user !== undefined) {
      navigator.serviceWorker.register('service-worker.js')
        .then(async serviceWorker => {
          let subscription = await serviceWorker.pushManager.getSubscription();
    
          if (!subscription) {
            // Public Key
            const publicKeyResponse = await axios.get('/api/notification');
    
            subscription = await serviceWorker.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: publicKeyResponse.data.publicKey,
            })
          }
          // Register
          await axios.post('/api/notification', subscription);
      });
    }
  }, []);

  return <div></div>;
}
