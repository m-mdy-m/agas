import type { RequestMethod } from './request-method.enum'

export interface RequestOptions {
  method?: RequestMethod
  headers?: Record<string, string>
  body?: any
  params?: Record<string, any>
  timeout?: number
  parseResponse?: boolean
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer'
  requestId?: string
}

export interface FetchOptions extends RequestInit {
  headers: Record<string, string>
  signal: AbortSignal
}

export interface ResponseObject<T = any> {
  id: string
  status: number
  statusText: string
  headers: Record<string, string>
  data: T
  duration: number
  ok: boolean
  response: Response
}
