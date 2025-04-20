# Agas CLI - Modern HTTP Client

Agas CLI is a modern HTTP client built on top of the Agas TypeScript library. It provides a simple and intuitive command-line interface for making HTTP requests, with beautiful terminal output and powerful features.

## Installation

### Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or higher)

### Install from source

1. Clone the repository

```bash
git clone https://github.com/yourusername/agas-cli.git
cd agas-cli
```

2. Install dependencies

```bash
bun install
```

3. Link the CLI for global usage

```bash
bun link
```

## Usage

### Basic Commands

```bash
# Basic GET request
agas @get https://api.example.com/users

# POST request with JSON body
agas @post https://api.example.com/users -d '{"name":"John Doe","email":"john@example.com"}'

# PUT request with JSON content type
agas @put https://api.example.com/users/1 -t json -d '{"name":"Updated Name"}'

# DELETE request
agas @delete https://api.example.com/users/1

# PATCH request
agas @patch https://api.example.com/users/1 -d '{"status":"inactive"}'
```

### Advanced Options

```bash
# Add custom headers
agas @get https://api.example.com/users -H "Authorization: Bearer token123"

# URL parameters
agas @get https://api.example.com/search -p '{"q":"search term","page":1}'

# Verbose output
agas @get https://api.example.com/users --verbose

# Silent mode (only show response body)
agas @get https://api.example.com/users --silent

# Format output
agas @get https://api.example.com/users --format json
```

### Help and Information

```bash
# Show help information
agas --help

# Show version
agas --version

# Show introduction
agas intro
```

## Features

- Support for all common HTTP methods (GET, POST, PUT, DELETE, PATCH)
- JSON request and response handling
- Custom headers and URL parameters
- Beautiful and colorful terminal output
- Progress indicators with spinners
- Verbose mode for detailed request/response information
- Silent mode for scripting

## License

MIT
