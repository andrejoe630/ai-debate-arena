// Firebase initialization
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

if (!getApps().length && firebaseConfig.apiKey) {
  initializeApp(firebaseConfig)
}

export const auth = firebaseConfig.apiKey ? getAuth() : null
export const googleProvider = firebaseConfig.apiKey ? new GoogleAuthProvider() : null

export const isAuthConfigured = Boolean(firebaseConfig.apiKey)
