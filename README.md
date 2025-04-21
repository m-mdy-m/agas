# Agas

<div align="center">

```
╭──────╮ ╭────╮ ╭────╮ ╭────╮
│  ▄▀▄ │ │ ▄▀▀│ │ ▄▀▀│ │ ▀▀▄│
│  █ █ │ │ ▀▀▄│ │ ▀▀▄│ │ ▄▄▀│
╰──────╯ ╰────╯ ╰────╯ ╰────╯
         A G A S
```

[![npm version](https://img.shields.io/npm/v/@medishn/agas.svg)](https://www.npmjs.com/package/@medishn/agas)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bun Compatible](https://img.shields.io/badge/Bun-Compatible-orange.svg)](https://bun.sh)
[![Docker](https://img.shields.io/badge/Docker-Available-blue.svg)](https://hub.docker.com/r/bitsgenix/agas)

</div>

Agas is a minimal, CLI-friendly HTTP client powered by Bun. It provides a simple and intuitive interface for making HTTP requests directly from your terminal or within your JavaScript/TypeScript applications.

## Features

- **Lightweight and Fast**: Built on Bun for performance
- **Beautiful CLI Interface**: With colors and loading spinners
- **Event-driven Architecture**: Subscribe to request and response events
- **Modern HTTP Features**: JSON, FormData, streaming, timeouts, and more
- **Easy to Use API**: Simple methods for common HTTP verbs
- **Type-safe**: Written in TypeScript with full type definitions
- **Docker Support**: Run in containers without dependencies

## Installation

### Using npm/yarn/bun

```bash
# Using npm
npm install @medishn/agas

# Using yarn
yarn add @medishn/agas

# Using bun
bun add @medishn/agas
```

### Global CLI Installation

```bash
# Using npm
npm install -g @medishn/agas

# Using bun
bun install -g @medishn/agas
```

### Using Docker

```bash
# Pull the image
docker pull medishn/agas:latest

# Run a simple command
docker run --rm medishn/agas @get https://httpbin.org/get
```

## Quick Start

### CLI Usage

```bash
# Display intro animation
agas intro

# Make a GET request
agas @get https://api.example.com/users

# POST with JSON data
agas @post https://api.example.com/users -d '{"name":"John Doe","email":"john@example.com"}'

# Add headers
agas @get https://api.example.com/users -H "Authorization: Bearer token123"

# With URL parameters
agas @get https://api.example.com/search -p '{"q":"javascript","limit":10}'

# Different content types
agas @post https://api.example.com/data -t html -d "<h1>Hello World</h1>"

# Verbose output with detailed request/response info
agas @get https://api.example.com/users --verbose

# Silent mode (only print response body)
agas @get https://api.example.com/users --silent
```

### JavaScript/TypeScript API

```typescript
import { Agas } from '@medishn/agas'

const client = new Agas()

// Simple GET request
const response = await client.get('https://api.example.com/users')
console.log(response.data)

// POST request with data
const newUser = await client.post('https://api.example.com/users', {
  name: 'John Doe',
  email: 'john@example.com',
})

// Using the generic request method
const response = await client.request('https://api.example.com/users', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer token123',
  },
  body: {
    name: 'John Doe',
  },
})

// Subscribe to events
client.onRequest((data) => {
  console.log(`Request started: ${data.method} ${data.url}`)
})

client.onResponse((data) => {
  console.log(`Response received: ${data.status} in ${data.duration}ms`)
})

client.onError((data) => {
  console.error(`Request failed: ${data.error.message}`)
})
```

## CLI Reference

### Basic Syntax

```
agas @<method> <url> [options]
```

### Methods

- `@get` - GET request
- `@post` - POST request
- `@put` - PUT request
- `@delete` - DELETE request
- `@patch` - PATCH request

### Options

| Option                     | Description                        |
| -------------------------- | ---------------------------------- |
| `-H, --header <key:value>` | Add request header                 |
| `-d, --data <data>`        | Request body data (JSON or string) |
| `-t, --type <type>`        | Content type (json, html, text)    |
| `-p, --params <json>`      | URL parameters as JSON             |
| `--verbose`                | Show detailed output               |
| `--silent`                 | Show only response body            |
| `--format <format>`        | Output format (json, raw)          |
| `--help`                   | Show help information              |
| `--version`                | Show version                       |

## API Reference

### `Agas` Class

#### Constructor

```typescript
const client = new Agas()
```

#### Methods

| Method                      | Description                              |
| --------------------------- | ---------------------------------------- |
| `request(url, options)`     | Generic request method with full options |
| `get(url, options)`         | Shorthand for GET requests               |
| `post(url, body, options)`  | Shorthand for POST requests              |
| `put(url, body, options)`   | Shorthand for PUT requests               |
| `patch(url, body, options)` | Shorthand for PATCH requests             |
| `delete(url, options)`      | Shorthand for DELETE requests            |
| `head(url, options)`        | Shorthand for HEAD requests              |
| `options(url, options)`     | Shorthand for OPTIONS requests           |

#### Event Listeners

| Event                  | Description                        |
| ---------------------- | ---------------------------------- |
| `onRequest(callback)`  | Called when a request starts       |
| `onResponse(callback)` | Called when a response is received |
| `onError(callback)`    | Called when a request fails        |

### Request Options

```typescript
interface RequestOptions {
  method?: RequestMethod
  headers?: Record<string, string>
  body?: any
  params?: Record<string, any>
  timeout?: number
  parseResponse?: boolean
  responseType?: 'auto' | 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData'
  followRedirects?: boolean
  maxRedirects?: number
  allowInsecure?: boolean
  credentials?: RequestCredentials
  compress?: boolean
  keepalive?: boolean
  requestId?: string
  referrer?: string
  referrerPolicy?: ReferrerPolicy
}
```

### Response Object

```typescript
interface ResponseObject<T = any> {
  id: string
  status: number
  statusText: string
  headers: Record<string, string>
  data: T
  duration: number
  ok: boolean
  redirected: boolean
  url: string
  type: string
  response: Response
}
```

## Advanced Usage

### Handling Different Response Types

```typescript
// Auto-detect response type (default)
const jsonResponse = await client.get('https://api.example.com/data')

// Force text response
const textResponse = await client.get('https://api.example.com/text', {
  responseType: 'text',
})

// Get binary data
const imageResponse = await client.get('https://api.example.com/image', {
  responseType: 'blob',
})
```

### Working with FormData

```typescript
const formData = new FormData()
formData.append('name', 'John Doe')
formData.append('file', new Blob(['content'], { type: 'text/plain' }))

const response = await client.post('https://api.example.com/upload', formData)
```

### Setting Timeouts

```typescript
// Set a 5-second timeout
const response = await client.get('https://api.example.com/slow-endpoint', {
  timeout: 5000, // 5 seconds
})
```

### Working with Event Listeners

```typescript
// Create a logger that tracks all requests
function setupRequestLogger(client) {
  const requests = new Map()

  client.onRequest((data) => {
    requests.set(data.id, {
      method: data.method,
      url: data.url,
      startTime: Date.now(),
    })
    console.log(`Starting request ${data.id}: ${data.method} ${data.url}`)
  })

  client.onResponse((data) => {
    const request = requests.get(data.id)
    if (request) {
      console.log(
        `Request ${data.id} completed with status ${data.status} in ${data.duration}ms`
      )
      requests.delete(data.id)
    }
  })

  client.onError((data) => {
    const request = requests.get(data.id)
    if (request) {
      console.error(`Request ${data.id} failed: ${data.error.message}`)
      requests.delete(data.id)
    }
  })
}

const client = new Agas()
setupRequestLogger(client)
```

## Docker Usage

### Basic Usage

```bash
docker run --rm medishn/agas @get https://api.example.com/users
```

### Pass Environment Variables

```bash
docker run --rm -e "API_KEY=your_key" medishn/agas @get https://api.example.com/users -H "Authorization: Bearer $API_KEY"
```

### Using Docker Compose

```yaml
# docker-compose.yml
version: '3'
services:
  agas:
    image: medishn/agas:latest
    environment:
      - API_URL=https://api.example.com
```

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- TypeScript >= 5.0.0

### Build from Source

```bash
# Clone the repository
git clone https://github.com/m-mdy-m/agas.git
cd agas

# Install dependencies
bun install

# Build the library
bun run build

# Build the CLI
bun run build:cli

# Run tests
bun test
```

### Docker Development

```bash
# Build the Docker image
bun run docker:build

# Test the Docker image
bun run docker:run
```

## License

MIT © [Mahdi](https://github.com/m-mdy-m)

---

## 🤝 Contributing

Contributions, suggestions, and improvements are very welcome!
Please see the [Contributing Guide](./docs/CONTRIBUTING.md) to get started.

Also, make sure to check out our [Code of Conduct](./docs/CODE_OF_CONDUCT.md).

## 🔐 Security

If you discover any security-related issues, please read our [Security Policy](./docs/SECURITY.md) for guidance on responsible disclosure.

---

## 🚀 Getting Started

Check out the [User Guide](./User_Guide.md) to learn how to use Agas effectively.

---

## 🗒 Changelog

You can view the list of recent changes in the [CHANGELOG](./docs/CHANGELOG.md).

---

## Acknowledgements

- Built with [Bun](https://bun.sh)
- Uses [GlandJS](https://github.com/glandjs/gland) for event handling
