import {
  RequestMethod,
  type FetchOptions,
  type RequestOptions,
  type ResponseObject,
} from 'src/common'
import type { AgasEvents } from './agas-broker'
import { UrlBuilder } from './utils/url-builder.util'
import { ResponseParser } from './utils/response-parser.util'
import { ResponseFormat } from './utils/response-format.util'

/**
 * Fetch - Core class for making HTTP requests
 */
export class Fetch {
  private events: AgasEvents

  constructor(events: AgasEvents) {
    this.events = events
  }

  /**
   * Execute HTTP request
   */
  async execute<T = any>(
    url: string,
    options: RequestOptions
  ): Promise<ResponseObject<T>> {
    const {
      method = RequestMethod.GET,
      headers = {},
      body = {},
      params = {},
      timeout = 30000,
      parseResponse = true,
      responseType = 'auto',
      followRedirects = true,
      allowInsecure = false,
      compress = true,
      requestId = crypto.randomUUID(),
    } = options

    const startTime = performance.now()
    const fullUrl = UrlBuilder.build(url, params)

    const fetchOptions: FetchOptions = {
      method: method,
      headers: ResponseParser.prepareHeaders(headers),
      signal: AbortSignal.timeout(timeout),
      redirect: followRedirects ? 'follow' : 'manual',
      referrer: options.referrer,
      referrerPolicy: options.referrerPolicy,
      keepalive: options.keepalive,
      credentials: options.credentials,
    }

    if (allowInsecure) {
      fetchOptions.insecureHTTPParser = true
    }

    // Set up request body based on body type
    this.setupRequestBody(fetchOptions, body, method)

    // Add compression headers if needed
    if (
      compress &&
      !ResponseParser.hasHeader(fetchOptions.headers, 'Accept-Encoding')
    ) {
      fetchOptions.headers['Accept-Encoding'] = 'gzip, deflate, br'
    }

    this.events.emitRequestStart({
      id: requestId,
      method,
      url: fullUrl,
      headers: fetchOptions.headers,
      body: fetchOptions.body
        ? ResponseFormat.formatBodyForLogging(fetchOptions.body)
        : undefined,
      start: startTime,
    })

    try {
      const response = await fetch(fullUrl, fetchOptions)

      const endTime = performance.now()
      const duration = endTime - startTime

      let parsedBody: any
      let detectedType = 'unknown'

      if (parseResponse) {
        detectedType = this.determineResponseType(response, responseType)
        parsedBody = await this.parseResponseBody(response, detectedType)
      } else {
        parsedBody = response
      }

      const responseObject: ResponseObject<T> = {
        id: requestId,
        status: response.status,
        statusText: response.statusText,
        headers: ResponseParser.parseHeaders(response.headers),
        data: parsedBody as T,
        duration,
        ok: response.ok,
        response,
        type: detectedType,
        redirected: response.redirected,
        url: response.url,
      }

      this.events.emitResponseReceived({
        id: requestId,
        status: response.status,
        body: ResponseFormat.formatBodyForLogging(parsedBody),
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

      throw ResponseFormat.enhanceError(errorObject, {
        requestId,
        url: fullUrl,
        method,
      })
    }
  }

  /**
   * Setup request body based on body type and HTTP method
   */
  private setupRequestBody(
    fetchOptions: FetchOptions,
    body: any,
    method: RequestMethod
  ): void {
    const methodSupportsBody = ![
      RequestMethod.GET,
      RequestMethod.HEAD,
      RequestMethod.OPTIONS,
    ].includes(method)

    if (body && methodSupportsBody) {
      if (body instanceof FormData) {
        fetchOptions.body = body
      } else if (body instanceof URLSearchParams) {
        fetchOptions.body = body
        if (!ResponseParser.hasContentType(fetchOptions.headers)) {
          fetchOptions.headers['Content-Type'] =
            'application/x-www-form-urlencoded'
        }
      } else if (body instanceof Blob || body instanceof ArrayBuffer) {
        fetchOptions.body = body
        if (!ResponseParser.hasContentType(fetchOptions.headers)) {
          fetchOptions.headers['Content-Type'] = 'application/octet-stream'
        }
      } else if (typeof body === 'object') {
        fetchOptions.body = JSON.stringify(body)
        if (!ResponseParser.hasContentType(fetchOptions.headers)) {
          fetchOptions.headers['Content-Type'] = 'application/json'
        }
      } else {
        fetchOptions.body = String(body)
        if (!ResponseParser.hasContentType(fetchOptions.headers)) {
          fetchOptions.headers['Content-Type'] = 'text/plain'
        }
      }
    }
  }

  /**
   * Determine response type based on content type headers or explicit setting
   */
  private determineResponseType(
    response: Response,
    responseType: string
  ): string {
    if (responseType === 'auto') {
      return ResponseFormat.detectContentType(response)
    }
    return responseType
  }

  /**
   * Parse response body based on content type
   */
  private async parseResponseBody(
    response: Response,
    type: string
  ): Promise<any> {
    if (response.status === 204) {
      return null
    }
    switch (type) {
      case 'json':
        return await ResponseParser.parseJson(response)
      case 'text':
        return await response.text()
      case 'blob':
        return await response.blob()
      case 'arrayBuffer':
        return await response.arrayBuffer()
      case 'formData':
        try {
          return await response.formData()
        } catch (e) {
          return await response.text()
        }
      default:
        return await response.text()
    }
  }
}
