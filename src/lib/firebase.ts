import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, type Messaging } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: 'AIzaSyBWanXNXNO8ROsndyUaOr1tYUwNHWWT7es',
  authDomain: 'catalyst-mom-app.firebaseapp.com',
  projectId: 'catalyst-mom-app',
  storageBucket: 'catalyst-mom-app.firebasestorage.app',
  messagingSenderId: '99975504315',
  appId: '1:99975504315:web:c166abb3dfc50a46f6e49e',
  measurementId: 'G-238DJM9X32',
};

export const VAPID_KEY = 'BNE3CbrZIF5fS_HMByom1M9MuwcEn_aRiIJS3LFQRJdp7plk40tKMqHQMH07zSm1ZgkKxTVAsVDTfk7ofy3BfM0';

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

let messagingInstance: Messaging | null = null;

export async function getMessagingIfSupported(): Promise<Messaging | null> {
  try {
    if (!(await isSupported())) return null;
    if (!messagingInstance) messagingInstance = getMessaging(firebaseApp);
    return messagingInstance;
  } catch {
    return null;
  }
}

export { getToken, onMessage };
