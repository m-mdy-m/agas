/**
 * ResponseFormat - Handles formatting of response data
 */
export class ResponseFormat {
  /**
   * Format body data for logging purposes
   */
  static formatBodyForLogging(body: any): string {
    if (body === null || body === undefined) {
      return 'null'
    }

    if (typeof body === 'string') {
      return body.length > 1000
        ? `${body.substring(0, 1000)}... (truncated)`
        : body
    }

    if (
      body instanceof FormData ||
      body instanceof Blob ||
      body instanceof ArrayBuffer
    ) {
      return `[${body.constructor.name}]`
    }

    try {
      const stringified = JSON.stringify(body)
      return stringified.length > 1000
        ? `${stringified.substring(0, 1000)}... (truncated)`
        : stringified
    } catch (e) {
      return String(body)
    }
  }

  /**
   * Detect response content type based on headers
   */
  static detectContentType(response: Response): string {
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return 'json'
    } else if (contentType.includes('text/')) {
      return 'text'
    } else if (
      contentType.includes('image/') ||
      contentType.includes('audio/') ||
      contentType.includes('video/') ||
      contentType.includes('application/octet-stream')
    ) {
      return 'blob'
    } else {
      return 'text'
    }
  }

  /**
   * Enhance error with request context
   */
  static enhanceError(
    error: Error,
    context: { requestId: string; url: string; method: string }
  ): Error {
    Object.assign(error, { context })
    return error
  }
}
