import { useCallback, useMemo } from 'react'

import { useAuth } from './auth'
import { config } from './config'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function parse<T>(resp: Response): Promise<T> {
  if (!resp.ok) {
    let detail = resp.statusText
    try {
      const body = await resp.json()
      detail = body.detail ?? detail
    } catch {
      // non-JSON error body; keep statusText
    }
    throw new ApiError(resp.status, detail)
  }
  if (resp.status === 204) return undefined as T
  return resp.json() as Promise<T>
}

/** Public, unauthenticated GET. */
export async function apiGet<T>(path: string): Promise<T> {
  const resp = await fetch(`${config.apiUrl}${path}`)
  return parse<T>(resp)
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

/** React hook exposing authenticated admin API helpers. */
export function useAdminApi() {
  const { getToken } = useAuth()

  const request = useCallback(
    async <T,>(method: Method, path: string, body?: unknown): Promise<T> => {
      const token = await getToken()
      const resp = await fetch(`${config.apiUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      })
      return parse<T>(resp)
    },
    [getToken],
  )

  return useMemo(
    () => ({
      get: <T,>(path: string) => request<T>('GET', path),
      post: <T,>(path: string, body?: unknown) => request<T>('POST', path, body),
      put: <T,>(path: string, body?: unknown) => request<T>('PUT', path, body),
      del: <T,>(path: string) => request<T>('DELETE', path),
      /** Upload a file: request a signed URL, PUT the bytes, return public URL. */
      uploadFile: async (file: File): Promise<string> => {
        const { upload_url, public_url } = await request<{
          upload_url: string
          public_url: string
        }>('POST', '/api/admin/media/upload-url', {
          filename: file.name,
          content_type: file.type || 'application/octet-stream',
        })
        await fetch(upload_url, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        })
        return public_url
      },
    }),
    [request],
  )
}
