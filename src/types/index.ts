export type Method = "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "HEAD" | "OPTIONS"
//Type of Response for output 
export type TResponse = "auto"|"json"|"text"|"blob"|"arrayBuffer"
export interface AgasConfig {
    baseURL?:string;
    timeout?:number;
    headers?: Record<string, string>;
    validateStatus?: (status: number) => boolean;
    maxRedirects?: number;
    responseType?: TResponse;
}

export interface RequestConfig {
  method?: Method;
  url: string;
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  validateStatus?: (status: number) => boolean;
  responseType?: TResponse;
  credentials?: any;
}

export interface ResponseConfig<T = any> {
  id: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
  config: RequestConfig;
  request: {
    url: string;
    method: Method;
  };
  duration: number;
}

export interface Interceptor<T> {
  fulfilled?: (value: T) => T | Promise<T>;
  rejected?: (error: any) => any;
}

export interface InterceptorManager<T> {
  handlers: Interceptor<T>[];
  use(
    fulfilled?: (value: T) => T | Promise<T>,
    rejected?: (error: any) => any
  ): number;
  eject(id: number): void;
}


