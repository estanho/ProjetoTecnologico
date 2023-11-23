'use client'

import axios from "axios";
import { useEffect } from "react";

export function Notification({ session }: any) {

  useEffect(()=> {
    if ('navigator' in window && session.user !== undefined) {
      navigator.serviceWorker.register('service-worker.js')
        .then(async serviceWorker => {
          let subscription = await serviceWorker.pushManager.getSubscription();

          const config = {
            headers: { Authorization: `Bearer ${session.access_token}` },
          };
    
          if (!subscription) {
    
            const publicKeyResponse = await axios.get('http://localhost:3001/notification/public_key', config);
    
            subscription = await serviceWorker.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: publicKeyResponse.data.publicKey,
            })
          }

          await axios.post('http://localhost:3001/notification/register', 
            subscription,
            config,
          );
      });
    }
  }, []);

  return <div></div>;
}
