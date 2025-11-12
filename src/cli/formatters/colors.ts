export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

export function getStatusColor(status: number, c: typeof colors): string {
  if (status >= 200 && status < 300) {
    return c.green;
  } else if (status >= 300 && status < 400) {
    return c.cyan;
  } else if (status >= 400 && status < 500) {
    return c.yellow;
  } else {
    return c.red;
  }
}

export function noColors() {
  return {
    reset: '',
    bright: '',
    dim: '',
    red: '',
    green: '',
    yellow: '',
    blue: '',
    magenta: '',
    cyan: '',
    white: '',
    gray: '',
  };
}
