/**
 * Frontend runtime configuration, read from Vite env vars at build time.
 *
 * `authMode`:
 *  - "mock"     -> local allowlisted-email sign-in that mints a `dev:<email>`
 *                  token (matches backend mock auth; no Firebase needed).
 *  - "firebase" -> Google sign-in in production; non-allowlisted emails are
 *                  signed out immediately.
 */
export const config = {
  apiUrl: (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:8000',
  authMode: (import.meta.env.VITE_AUTH_MODE as string | undefined) || 'mock',
  adminEmails: ((import.meta.env.VITE_ADMIN_EMAILS as string | undefined) || 'admin@example.com')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  },
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return config.adminEmails.includes(email.toLowerCase())
}
