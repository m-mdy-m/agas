import {CLIConfig} from "../types"
export function getEnvVar(key: string, defaultValue: string = ''): string {
  return process.env[`AGAS_${key.toUpperCase()}`] || defaultValue;
}

export function setEnvVar(key: string, value: string): void {
  process.env[`AGAS_${key.toUpperCase()}`] = value;
}

export function loadEnvConfig(): Partial<CLIConfig> {
  return {
    baseURL: getEnvVar('BASE_URL'),
    authToken: getEnvVar('AUTH_TOKEN'),
    timeout: parseInt(getEnvVar('TIMEOUT', '30000')),
  };
}
