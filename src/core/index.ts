import { EventEmitter } from "@glandjs/emitter"
import {AgasConfig,InterceptorManager,RequestConfig,ResponseConfig,Interceptor,TResponse} from "../types"
export class Agas {
    private config!:AgasConfig;
    private emitter = new EventEmitter()
    private interceptors:{
      request:InterceptorManager<RequestConfig>
      response:InterceptorManager<ResponseConfig>
    }
    constructor(config:AgasConfig){
      this.config = {
        baseURL:config?.baseURL ?? "",
        timeout:config?.timeout ?? 300000,
        headers:config?.headers ?? {},
        validateStatus:config?.validateStatus ?? ((s:any)=> s >=200 && s<300),
        maxRedirects: config?.maxRedirects ?? 5,
        responseType: config?.responseType??'auto'
      }
   this.interceptors = {
      request: new RequestInterceptorManager(),
      response: new ResponseInterceptorManager(),
    };
  }

  /**
   * Make HTTP request
   */
  async request<T = any>(config: RequestConfig): Promise<ResponseConfig<T>> {
    const startTime = performance.now();
    const requestId = crypto.randomUUID();

    try {
      const mergedConfig = this.mergeConfig(config);
      let finalConfig = await this.applyRequestInterceptors(mergedConfig);
      const url = this.buildURL(finalConfig?.url, finalConfig?.params);

      // Emit request event
      this.emitter.emit('request', {
        id: requestId,
        method: finalConfig?.method,
        url,
        headers: finalConfig?.headers,
        data: finalConfig?.data,
      });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), finalConfig?.timeout);

      try {
        console.log("url:",url)
        const response = await fetch(url, {
          method: finalConfig?.method,
          headers: finalConfig?.headers,
          body: this.serializeBody(finalConfig?.data, finalConfig?.headers),
          signal: controller.signal,
          redirect: 'follow',
          credentials: finalConfig?.credentials,
        });

        clearTimeout(timeoutId);
        const data = await this.parseResponse<T>(response, finalConfig?.responseType);
        const duration = performance.now() - startTime;

        let agasResponse: ResponseConfig<T> = {
          id: requestId,
          status: response.status,
          statusText: response.statusText,
          headers: this.parseHeaders(response.headers),
          data,
          config: finalConfig,
          request: { url, method: finalConfig.method },
          duration,
        };

        agasResponse = await this.applyResponseInterceptors(agasResponse);

        if (!finalConfig?.validateStatus(response.status)) {
          throw new AgasError('Request failed with status ' + response.status, agasResponse);
        }

        this.emitter.emit('response', {
          id: requestId,
          status: response.status,
          duration,
          data,
        });

        return agasResponse;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      this.emitter.emit('error', {
        id: requestId,
        error: error instanceof Error ? error : new Error(String(error)),
        duration,
      });

      throw error;
    }
  }

  /**
   * GET request
   */
  get<T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'url'>): Promise<ResponseConfig<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * POST request
   */
  post<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>): Promise<ResponseConfig<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * PUT request
   */
  put<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>): Promise<ResponseConfig<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * DELETE request
   */
  delete<T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'url'>): Promise<ResponseConfig<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * PATCH request
   */
  patch<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'method' | 'url' | 'data'>): Promise<ResponseConfig<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  /**
   * HEAD request
   */
  head<T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'url'>): Promise<ResponseConfig<T>> {
    return this.request<T>({ ...config, method: 'HEAD', url });
  }

  /**
   * OPTIONS request
   */
  options<T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'url'>): Promise<ResponseConfig<T>> {
    return this.request<T>({ ...config, method: 'OPTIONS', url });
  }

  /**
   * Event listeners
   */
  on(event: string, handler: (...args: any[]) => void) {
    return this.emitter.on(event, handler);
  }

  off(event: string, handler: (...args: any[]) => void) {
    return this.emitter.off(event, handler);
  }

  /**
   * Private methods
   */
 
  private mergeConfig(config: RequestConfig): RequestConfig {
    return {
      method: config.method || 'GET',
      url: config.url,
      baseURL: config.baseURL || this.config.baseURL,
      headers: { ...this.config.headers, ...config.headers },
      params: config.params,
      data: config.data,
      timeout: config.timeout !== undefined ? config.timeout : this.config.timeout,
      validateStatus: config.validateStatus || this.config.validateStatus,
      responseType: config.responseType || this.config.responseType,
      credentials: config.credentials,
    };
  }

  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.config.baseURL}${url}`;
    
    if (!params || Object.keys(params).length === 0) {
      return fullURL;
    }

    const urlObj = new URL(fullURL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => urlObj.searchParams.append(key, String(v)));
        } else {
          urlObj.searchParams.append(key, String(value));
        }
      }
    });

    return urlObj.toString();
  }

  private serializeBody(data: any, headers: Record<string, string>): any | null | undefined {
    if (!data) return undefined;

    if (data instanceof FormData || data instanceof URLSearchParams || 
        data instanceof Blob || data instanceof ArrayBuffer) {
      return data;
    }

    const contentType = Object.keys(headers).find(
      key => key.toLowerCase() === 'content-type'
    );

    if (contentType && headers[contentType]?.includes('application/json')) {
      return JSON.stringify(data);
    }

    if (typeof data === 'object') {
      headers['Content-Type'] = 'application/json';
      return JSON.stringify(data);
    }

    return String(data);
  }

  private async parseResponse<T>(response: ResponseConfig<any>, responseType: string): Promise<T> {
    if (response.status === 204 || response?.headers.get('content-length') === '0') {
      return null as T;
    }

    const contentType = response.headers.get('content-type') || '';

    if (responseType === 'auto') {
      if (contentType.includes('application/json')) {
        return await response.json();
      } else if (contentType.includes('text/')) {
        return await response.text() as T;
      } else if (contentType.includes('application/octet-stream') || 
                 contentType.includes('image/') ||
                 contentType.includes('video/')) {
        return await response.blob() as T;
      }
      
      try {
        return await response.json();
      } catch {
        return await response.text() as T;
      }
    }

    switch (responseType) {
      case 'json':
        return await response.json();
      case 'text':
        return await response.text() as T;
      case 'blob':
        return await response.blob() as T;
      case 'arrayBuffer':
        return await response.arrayBuffer() as T;
      default:
        return await response.text() as T;
    }
  }

  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let result = config;
    for (const interceptor of this.interceptors.request.handlers) {
      if (interceptor.fulfilled) {
        result = await interceptor.fulfilled(result);
      }
    }
    return result;
  }

  private async applyResponseInterceptors(response: ResponseConfig): Promise<ResponseConfig> {
    let result = response;
    for (const interceptor of this.interceptors.response.handlers) {
      if (interceptor.fulfilled) {
        result = await interceptor.fulfilled(result);
      }
    }
    return result;
  }
}

/**
 * Interceptor Managers
 */
class RequestInterceptorManager implements InterceptorManager<RequestConfig> {
  handlers: Interceptor<RequestConfig>[] = [];

  use(
    fulfilled?: (value: RequestConfig) => RequestConfig | Promise<RequestConfig>,
    rejected?: (error: any) => any
  ): number {
    this.handlers.push({ fulfilled, rejected });
    return this.handlers.length - 1;
  }

  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null as any;
    }
  }
}

class ResponseInterceptorManager implements InterceptorManager<ResponseConfig> {
  handlers: Interceptor<ResponseConfig>[] = [];

  use(
    fulfilled?: (value: ResponseConfig) => ResponseConfig | Promise<ResponseConfig>,
    rejected?: (error: any) => any
  ): number {
    this.handlers.push({ fulfilled, rejected });
    return this.handlers.length - 1;
  }

  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null as any;
    }
  }
}

/**
 * Custom Error
 */
export class AgasError extends Error {
  response?: ResponseConfig;
  config?: RequestConfig;

  constructor(message: string, response?: ResponseConfig, config?: RequestConfig) {
    super(message);
    this.name = 'AgasError';
    this.response = response;
    this.config = config;
  }
}
