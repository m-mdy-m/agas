
export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidMethod(method: string): boolean {
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  return validMethods.includes(method.toUpperCase());
}

export function isValidTimeout(timeout: any): boolean {
  return typeof timeout === 'number' && timeout > 0 && timeout <= 300000; // Max 5 minutes
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function validateConfig(config: any): string[] {
  const errors: string[] = [];
  
  if (config.baseURL && !isValidURL(config.baseURL)) {
    errors.push('Invalid baseURL');
  }
  
  if (config.timeout && !isValidTimeout(config.timeout)) {
    errors.push('Invalid timeout (must be between 1 and 300000ms)');
  }
  
  return errors;
}
