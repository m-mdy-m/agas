import {
  RequestMethod,
  type RequestOptions,
  type ResponseObject,
} from 'src/common'
import { Fetch } from './fetch'
import type { AgasEvents } from './agas-broker'

export class RequestHandler<T = any> {
  private fetch: Fetch
  private url: string
  private options: RequestOptions

  constructor(events: AgasEvents, url: string, options?: RequestOptions) {
    this.fetch = new Fetch(events)
    this.url = url
    this.options = {
      method: RequestMethod.GET,
      headers: {},
      body: {},
      params: {},
      timeout: 30000,
      parseResponse: true,
      responseType: 'auto',
      followRedirects: true,
      allowInsecure: false,
      compress: true,
      requestId: crypto.randomUUID(),
      ...options,
    }
  }

  async request(): Promise<ResponseObject<T>> {
    return this.fetch.execute<T>(this.url, this.options)
  }
}
