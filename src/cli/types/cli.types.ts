import {Method} from "../../types"
export interface CLIConfig {
  baseURL?: string;
  authToken?: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
  prettyPrint?: boolean;
  colorOutput?: boolean;
  saveHistory?: boolean;
}

export interface CLIOptions {
  headers?: Record<string, string>;
  query?: Record<string, any>;
  json?: Record<string, any>;
  form?: Record<string, any>;
  data?: string;
  file?: Record<string, string>;
  output?: string;
  pretty?: boolean;
  verbose?: boolean;
  silent?: boolean;
  follow?: boolean;
  timeout?: number;
  save?: string;
  table?: boolean;
}

export interface SavedRequest {
  name: string;
  method: Method;
  url: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, any>;
  createdAt: string;
}

export interface RequestHistory {
  id: string;
  method: Method;
  url: string;
  status: number;
  duration: number;
  timestamp: string;
}
