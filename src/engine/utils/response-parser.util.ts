import type { HeadersInit } from 'bun'

/**
 * ResponseParser - Responsible for parsing HTTP responses
 */
export class ResponseParser {
  /**
   * Parse response headers into a plain object
   */
  static parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  /**
   * Safely parse JSON response
   */
  static async parseJson(response: Response): Promise<any> {
    try {
      return await response.json()
    } catch (e) {
      return await response.text()
    }
  }

  /**
   * Prepare request headers from different header formats
   */
  static prepareHeaders(headers: HeadersInit): Record<string, string> {
    if (headers instanceof Headers) {
      return ResponseParser.parseHeaders(headers)
    } else if (Array.isArray(headers)) {
      return Object.fromEntries(headers)
    }

    return { ...(headers as Record<string, string>) }
  }

  /**
   * Check if headers contain a specific header (case-insensitive)
   */
  static hasHeader(headers: HeadersInit, name: string): boolean {
    const normalizedName = name.toLowerCase()

    if (headers instanceof Headers) {
      return Array.from(headers.keys()).some(
        (key) => key.toLowerCase() === normalizedName
      )
    } else if (Array.isArray(headers)) {
      return headers.some(([key]) => key!.toLowerCase() === normalizedName)
    } else {
      return Object.keys(headers).some(
        (key) => key.toLowerCase() === normalizedName
      )
    }
  }

  /**
   * Check if headers contain a Content-Type header
   */
  static hasContentType(headers: HeadersInit): boolean {
    return ResponseParser.hasHeader(headers, 'content-type')
  }
}
