import { AgasEvents, RequestHandler } from './engine'
import {
  RequestMethod,
  type RequestOptions,
  type ResponseObject,
} from './common'

export class Agas {
  private events = new AgasEvents()
  async request<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ResponseObject<T>> {
    return new RequestHandler(this.events, url, options).request()
  }
  /**
   * Subscribe to request events
   */
  onRequest: AgasEvents['onRequest'] = (callback) => {
    return this.events.onRequest(callback)
  }

  /**
   * Subscribe to response events
   */
  onResponse: AgasEvents['onResponse'] = (callback) => {
    return this.events.onResponse(callback)
  }

  /**
   * Subscribe to error events
   */
  onError: AgasEvents['onError'] = (callback) => {
    return this.events.onError(callback)
  }

  /**
   * Convenience method for GET requests
   */
  get<T = any>(
    url: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ResponseObject<T>> {
    return this.request<T>(url, { ...options, method: RequestMethod.GET })
  }

  /**
   * Convenience method for POST requests
   */
  post<T = any>(
    url: string,
    body?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ResponseObject<T>> {
    return this.request<T>(url, {
      ...options,
      method: RequestMethod.POST,
      body,
    })
  }

  /**
   * Convenience method for PUT requests
   */
  put<T = any>(
    url: string,
    body?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ResponseObject<T>> {
    return this.request<T>(url, { ...options, method: RequestMethod.PUT, body })
  }

  /**
   * Convenience method for DELETE requests
   */
  delete<T = any>(
    url: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ResponseObject<T>> {
    return this.request<T>(url, { ...options, method: RequestMethod.DELETE })
  }

  /**
   * Convenience method for PATCH requests
   */
  patch<T = any>(
    url: string,
    body?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ResponseObject<T>> {
    return this.request<T>(url, {
      ...options,
      method: RequestMethod.PATCH,
      body,
    })
  }

  /**
   * Convenience method for HEAD requests
   */
  head<T = any>(
    url: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ResponseObject<T>> {
    return this.request<T>(url, { ...options, method: RequestMethod.HEAD })
  }

  /**
   * Convenience method for OPTIONS requests
   */
  options<T = any>(
    url: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ResponseObject<T>> {
    return this.request<T>(url, { ...options, method: RequestMethod.OPTIONS })
  }
}
