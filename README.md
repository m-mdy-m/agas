# Agas

<div align="center">

```
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

### Package Managers

```bash
# NPM
npm install -g agas

# Yarn
yarn global add agas

# Bun
bun install -g agas
```

### Docker

```bash
# Pull from Docker Hub
docker pull bitsgenix/agas:latest

# Run
docker run --rm bitsgenix/agas get https://api.github.com
```

### Binary

```bash
# Linux/macOS
curl -fsSL https://raw.githubusercontent.com/m-mdy-m/agas/main/scripts/install.sh | sh

# Windows
irm  https://raw.githubusercontent.com/m-mdy-m/agas/main/scripts/install.ps1 | iex
```

## Quick Start

### CLI

```bash
# Simple GET request
agas get https://api.github.com/users/octocat

# POST with JSON data
agas post https://httpbin.org/post \
  --json name=John \
  --json email=john@example.com

# With authentication
agas get https://api.github.com/user \
  -H "Authorization: Bearer YOUR_TOKEN"

# Pretty printed, table format
agas get https://api.github.com/users --pretty --table

# Save response to file
agas get https://api.github.com/users -o users.json

# Save request for later
agas post https://api.example.com/users \
  --json name=John \
  --save create-user

# Run saved request
agas run create-user
```

### API

```typescript
import { Agas } from '@medishn/agas';

// Create client
const client = new Agas({
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer token123'
  }
});

// Make request
const response = await client.get('/users');
console.log(response.data);

// With interceptors
client.interceptors.request.use((config) => {
  console.log('Sending:', config.method, config.url);
  return config;
});

// Listen to events
client.on('response', (data) => {
  console.log('Response:', data.status, data.duration + 'ms');
});
```

## Contributing

Contributions, suggestions, and improvements are very welcome!
Please see the [Contributing Guide](./docs/CONTRIBUTING.md) to get started.

Also, make sure to check out our [Code of Conduct](./docs/CODE_OF_CONDUCT.md).

## Security

If you discover any security-related issues, please read our [Security Policy](./docs/SECURITY.md) for guidance on responsible disclosure.

## Getting Started

Check out the [User Guide](./User_Guide.md) to learn how to use Agas effectively.

## Changelog

You can view the list of recent changes in the [CHANGELOG](./docs/CHANGELOG.md).

## Acknowledgments

- Built with [Bun](https://bun.sh)
- Inspired by [HTTPie](https://httpie.io) and [curl](https://curl.se)
- Event system powered by [@glandjs/emitter](https://github.com/glandjs/emitter)

## Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/m-mdy-m/agas?style=social)
![GitHub forks](https://img.shields.io/github/forks/m-mdy-m/agas?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/m-mdy-m/agas?style=social)

</div>

## Links

- **NPM**: https://www.npmjs.com/package/@medishn/agas
- **Docker Hub**: https://hub.docker.com/r/bitsgenix/agas
- **Documentation**: https://github.com/m-mdy-m/agas/tree/main/docs
- **Issues**: https://github.com/m-mdy-m/agas/issues
- **Changelog**: [CHANGELOG.md](docs/CHANGELOG.md)

<div align="center">

**[⬆ back to top](#agas)**

Made with ❤️ by [Mahdi](https://github.com/m-mdy-m)

</div>
