import { AgasEvents } from './engine'
import {
  RequestMethod,
  type RequestOptions,
  type ResponseObject,
  type FetchOptions,
} from './common'
import type { HeadersInit } from 'bun'

export class Agas {
  private events = new AgasEvents()

  async request<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ResponseObject<T>> {
    const {
      method = RequestMethod.GET,
      headers = {},
      body,
      params,
      timeout = 30000,
      parseResponse = true,
      responseType = 'json',
    } = options

    const requestId = options.requestId || crypto.randomUUID()
    const startTime = performance.now()

    const fullUrl = this.buildUrl(url, params)

    const fetchOptions: FetchOptions = {
      method,
      headers: this.prepareHeaders(headers),
      signal: AbortSignal.timeout(timeout),
    }

    const methodSupportsBody = ![
      RequestMethod.GET,
      RequestMethod.HEAD,
      RequestMethod.OPTIONS,
    ].includes(method)

    if (body && methodSupportsBody) {
      if (typeof body === 'object' && !(body instanceof FormData)) {
        fetchOptions.body = JSON.stringify(body)

        if (!this.hasContentType(fetchOptions.headers)) {
          fetchOptions.headers['Content-Type'] = 'application/json'
        }
      } else {
        fetchOptions.body = body
      }
    }

    this.events.emitRequestStart({
      id: requestId,
      method,
      url: fullUrl,
      headers: fetchOptions.headers,
      body: fetchOptions.body ? String(fetchOptions.body) : undefined,
      start: startTime,
    })

    try {
      const response = await fetch(fullUrl, fetchOptions)
      const endTime = performance.now()
      const duration = endTime - startTime

      let parsedBody: any

      if (parseResponse) {
        if (responseType === 'json') {
          parsedBody = await this.safeJsonParse(response)
        } else if (responseType === 'text') {
          parsedBody = await response.text()
        } else if (responseType === 'blob') {
          parsedBody = await response.blob()
        } else if (responseType === 'arrayBuffer') {
          parsedBody = await response.arrayBuffer()
        } else {
          parsedBody = await response.text()
        }
      }

      const responseObject: ResponseObject<T> = {
        id: requestId,
        status: response.status,
        statusText: response.statusText,
        headers: this.parseResponseHeaders(response.headers),
        data: parsedBody as T,
        duration,
        ok: response.ok,
        response, // Include original response object for advanced usage
      }

      this.events.emitResponseReceived({
        id: requestId,
        status: response.status,
        body:
          typeof parsedBody === 'object'
            ? JSON.stringify(parsedBody)
            : String(parsedBody),
        duration,
      })

      return responseObject
    } catch (error) {
      const errorObject =
        error instanceof Error ? error : new Error(String(error))

      this.events.emitError({
        id: requestId,
        error: errorObject,
      })

      throw this.enhanceError(errorObject, {
        requestId,
        url: fullUrl,
        method,
      })
    }
  }
  private hasContentType(headers: HeadersInit): boolean {
    if (headers instanceof Headers) {
      return headers.has('Content-Type') || headers.has('content-type')
    } else if (Array.isArray(headers)) {
      return headers.some(([key]) => key!.toLowerCase() === 'content-type')
    } else {
      return Object.keys(headers).some(
        (key) => key.toLowerCase() === 'content-type'
      )
    }
  }

  onRequest: AgasEvents['onRequest'] = (callback) => {
    return this.events.onRequest(callback)
  }
  onResponse: AgasEvents['onResponse'] = (callback) => {
    return this.events.onResponse(callback)
  }
  onError: AgasEvents['onError'] = (callback) => {
    return this.events.onError(callback)
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(url: string, params?: Record<string, any>): string {
    if (!params) return url

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value
            .map(
              (item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`
            )
            .join('&')
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      })
      .join('&')

    return queryString
      ? `${url}${url.includes('?') ? '&' : '?'}${queryString}`
      : url
  }

  /**
   * Safely parse JSON response
   */
  private async safeJsonParse(response: Response): Promise<any> {
    try {
      return await response.json()
    } catch (e) {
      return null
    }
  }

  private parseResponseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }
  private prepareHeaders(headers: HeadersInit): Record<string, string> {
    if (headers instanceof Headers) {
      return this.parseResponseHeaders(headers)
    } else if (Array.isArray(headers)) {
      return Object.fromEntries(headers)
    }

    return { ...(headers as Record<string, string>) }
  }

  private enhanceError(
    error: Error,
    context: { requestId: string; url: string; method: string }
  ): Error {
    Object.assign(error, { context })
    return error
  }

  get<T = any>(url: string): Promise<ResponseObject<T>> {
    return this.request<T>(url, { method: RequestMethod.GET })
  }

  post<T = any>(url: string, body?: any): Promise<ResponseObject<T>> {
    return this.request<T>(url, { method: RequestMethod.POST, body })
  }

  put<T = any>(url: string, body?: any): Promise<ResponseObject<T>> {
    return this.request<T>(url, { method: RequestMethod.PUT, body })
  }

  delete<T = any>(url: string): Promise<ResponseObject<T>> {
    return this.request<T>(url, { method: RequestMethod.DELETE })
  }
  patch<T = any>(url: string, body?: any): Promise<ResponseObject<T>> {
    return this.request<T>(url, { method: RequestMethod.PATCH, body })
  }
}
