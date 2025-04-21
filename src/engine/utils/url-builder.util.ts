/**
 * UrlBuilder - Responsible for building URLs with query parameters
 */
export class UrlBuilder {
  /**
   * Build URL with query parameters
   */
  static build(url: string, params?: Record<string, any>): string {
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
}