import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { firebaseConfig } from '@/services/config'

declare const self: ServiceWorkerGlobalScope & typeof globalThis & WorkerGlobalScope

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

onBackgroundMessage(messaging, (payload) => {
  console.log('FIREBASE MESSAGE PAYLOAD', payload)

  self.registration.showNotification(payload?.notification?.title || '', {
    body: payload?.notification?.body,
    icon: payload?.notification?.icon || '/pencilhead.svg',
  });
});
