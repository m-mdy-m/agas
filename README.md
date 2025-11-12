# Agas

A fast and simple HTTP client for the terminal and JavaScript. Built with Bun.

[![npm version](https://img.shields.io/npm/v/@medishn/agas.svg)](https://www.npmjs.com/package/@medishn/agas)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bun Compatible](https://img.shields.io/badge/Bun-Compatible-orange.svg)](https://bun.sh)
[![Docker](https://img.shields.io/badge/Docker-Available-blue.svg)](https://hub.docker.com/r/bitsgenix/agas)

## Features

- Fast performance with Bun runtime
- Simple command line interface
- Works as a JavaScript library
- Request history and saved requests
- Pretty output and table display
- Docker support

## Installation

```bash
# npm
npm install -g @medishn/agas

# yarn
yarn global add @medishn/agas

# bun
bun install -g @medishn/agas

# Install script (Linux/Mac)
curl -fsSL https://raw.githubusercontent.com/m-mdy-m/agas/main/scripts/install.sh | sh

# Install script (Windows)
irm https://raw.githubusercontent.com/m-mdy-m/agas/main/scripts/install.ps1 | iex

# Docker
docker pull bitsgenix/agas:latest
```

## Quick Start

### Command Line

```bash
# GET request
agas https://api.github.com/users/octocat

# POST with JSON
agas post https://httpbin.org/post --json name=John

# With headers
agas get https://api.github.com/user -H "Authorization: Bearer token"

# Pretty output
agas get https://api.github.com/users --pretty

# Save request
agas post https://api.example.com/users --json name=Test --save create-user

# Run saved request
agas run create-user
```

### JavaScript

```javascript
import { Agas } from '@medishn/agas';

const client = new Agas({
  baseURL: 'https://api.example.com',
  headers: { 'Authorization': 'Bearer token' }
});

const response = await client.get('/users');
console.log(response.data);
```

## CLI Options

| Option | Description |
|--------|-------------|
| `-H, --header` | Add request header |
| `-q, --query` | Add query parameter |
| `-d, --data` | Request body data |
| `--json` | Add JSON field |
| `-o, --output` | Save response to file |
| `--pretty` | Pretty print JSON |
| `-v, --verbose` | Show detailed output |
| `--silent` | Show only response body |
| `--timeout` | Request timeout in ms |
| `--save` | Save request for later |
| `--table` | Display as table |

## API Usage

```javascript
import { Agas } from '@medishn/agas';

const client = new Agas({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: { 'Authorization': 'Bearer token' }
});

// Make requests
await client.get('/users');
await client.post('/users', { name: 'Alice' });
await client.put('/users/123', { name: 'Alice Smith' });
await client.delete('/users/123');

// With options
await client.get('/users', {
  params: { page: 1, limit: 10 },
  headers: { 'Accept': 'application/json' }
});

// Error handling
try {
  const response = await client.get('/users');
} catch (error) {
  console.error(error.message);
}

// Events
client.on('request', (data) => {
  console.log(`Request: ${data.method} ${data.url}`);
});

client.on('response', (data) => {
  console.log(`Response: ${data.status} in ${data.duration}ms`);
});

// Interceptors
client.interceptors.request.use((config) => {
  config.headers['X-Custom'] = 'value';
  return config;
});
```

## Documentation

- [User Guide](./User_Guide.md) - Complete guide with examples
- [Changelog](./docs/CHANGELOG.md) - Version history
- [Contributing](./docs/CONTRIBUTING.md) - How to contribute
- [Security](./docs/SECURITY.md) - Security policy
- [Binary Distribution](./docs/BINARY_DISTRIBUTION.md) - Installation details

## Links

- NPM: https://www.npmjs.com/package/@medishn/agas
- Docker Hub: https://hub.docker.com/r/bitsgenix/agas
- Issues: https://github.com/m-mdy-m/agas/issues

## License

MIT License - Copyright (c) 2024-2025 Mahdi

---

Made by [Mahdi](https://github.com/m-mdy-m)