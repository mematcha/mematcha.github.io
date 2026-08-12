/**
 * Lazy Firebase Auth initialization.
 *
 * Returns null when Firebase is not configured (e.g. local mock mode), so the
 * rest of the app can degrade gracefully instead of crashing at import time.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

import { config } from './config'

let app: FirebaseApp | null = null
let authInstance: Auth | null = null

export function getFirebaseAuth(): Auth | null {
  if (config.authMode !== 'firebase') return null
  const { apiKey, authDomain, projectId, appId } = config.firebase
  if (!apiKey || !authDomain || !projectId || !appId) {
    console.warn('Firebase auth mode is set but configuration is incomplete.')
    return null
  }
  if (!app) {
    app = initializeApp({ apiKey, authDomain, projectId, appId })
    authInstance = getAuth(app)
  }
  return authInstance
}
