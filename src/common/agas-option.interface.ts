import type { RequestMethod } from './request-method.enum'
export type RequestCredentials = 'omit' | 'same-origin' | 'include'
export type ReferrerPolicy =
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url'

export interface RequestOptions {
  method?: RequestMethod
  headers?: Record<string, string>
  body?: any
  params?: Record<string, any>
  timeout?: number
  parseResponse?: boolean
  responseType?: 'auto' | 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
  followRedirects?: boolean
  maxRedirects?: number
  allowInsecure?: boolean
  credentials?: RequestCredentials
  compress?: boolean
  keepalive?: boolean
  requestId?: string
  referrer?: string
  referrerPolicy?: ReferrerPolicy
}

export interface FetchOptions extends RequestInit {
  headers: Record<string, string>
  signal: AbortSignal
  insecureHTTPParser?: boolean
}

export interface ResponseObject<T = any> {
  id: string
  status: number
  statusText: string
  headers: Record<string, string>
  data: T
  duration: number
  ok: boolean
  redirected: boolean
  url: string
  type: string
  response: Response
}
