import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, setConsent } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";

import { firebaseConfig } from './config'

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getFirestore(app);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

setConsent({
  ad_storage: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'denied',
})
