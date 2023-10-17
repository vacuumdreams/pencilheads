import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { firebaseConfig } from '@/services/config'

declare const self: ServiceWorkerGlobalScope & typeof globalThis & WorkerGlobalScope

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

let badgeCount = 0

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  if (event.data && event.data.type === 'RESET_BADGE') {
    console.log('reset badge')
    badgeCount = 0
    navigator?.clearAppBadge?.()
  }
})

onBackgroundMessage(messaging, (payload) => {
  badgeCount += 1
  navigator?.setAppBadge?.(badgeCount)

  self.registration.showNotification(payload?.notification?.title || '', {
    body: payload?.notification?.body,
    icon: payload?.notification?.icon || '/pencilhead.svg',
  });
});
