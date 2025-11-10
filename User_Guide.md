# Agas User Guide

```
╭──────╮ ╭────╮ ╭────╮ ╭────╮
│  ▄▀▄ │ │ ▄▀▀│ │ ▄▀▀│ │ ▀▀▄│
│  █ █ │ │ ▀▀▄│ │ ▀▀▄│ │ ▄▄▀│
╰──────╯ ╰────╯ ╰────╯ ╰────╯
         A G A S
```

**Version 1.0.0-alpha**

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
   - [Package Managers](#package-managers)
   - [Docker](#docker)
3. [Command Line Interface](#command-line-interface)
   - [Basic Syntax](#basic-syntax)
   - [Common Commands](#common-commands)
   - [Options in Detail](#options-in-detail)
   - [Examples](#cli-examples)
4. [JavaScript/TypeScript API](#javascripttypescript-api)
   - [Making Requests](#making-requests)
   - [Working with Response Data](#working-with-response-data)
   - [Error Handling](#error-handling)
   - [Event System](#event-system)
   - [Advanced Configuration](#advanced-configuration)
5. [Use Cases](#use-cases)
   - [API Testing](#api-testing)
   - [Backend Health Checks](#backend-health-checks)
   - [Data Fetching Scripts](#data-fetching-scripts)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Reference](#reference)
   - [Request Methods](#request-methods)
   - [Response Object Properties](#response-object-properties)
   - [Event Types](#event-types)

## Introduction

Agas is a minimal, CLI-friendly HTTP client built specifically for Bun. It provides both a command-line interface and a JavaScript/TypeScript API for making HTTP requests. Agas specializes in delivering a simple yet powerful interface for interacting with web APIs, featuring colorful terminal output, an event-driven architecture, and support for modern HTTP features.

Key features:
- Fast and lightweight Bun-based HTTP client
- Interactive command-line interface with color formatting
- Event-driven request/response cycle
- Support for JSON, FormData, and raw body formats
- Timeouts, redirection handling, and other modern HTTP features
- Comprehensive TypeScript definitions

## Installation

### Package Managers

#### Using npm
```bash
# Install globally for CLI usage
npm install -g @medishn/agas

# Install locally in a project
npm install @medishn/agas
```

#### Using Yarn
```bash
# Install globally for CLI usage
yarn global add @medishn/agas

# Install locally in a project
yarn add @medishn/agas
```

#### Using Bun
```bash
# Install globally for CLI usage
bun install -g @medishn/agas

# Install locally in a project
bun add @medishn/agas
```

### Docker

For environments where installing Node.js or Bun isn't desirable, Agas can be run via Docker:

```bash
# Pull the latest image
docker pull bitsgenix/agas:latest

# Run Agas commands
docker run --rm bitsgenix/agas @get https://api.example.com/users
```

## Command Line Interface

### Basic Syntax

The general format for Agas CLI commands is:

```
agas @<method> <url> [options]
```

Where:
- `@<method>` is one of the HTTP methods like `@get`, `@post`, etc.
- `<url>` is the URL to send the request to
- `[options]` are additional parameters that modify the request

### Common Commands

#### Display the intro animation
```bash
agas intro
```

#### Show help
```bash
agas --help
```

#### Show version
```bash
agas --version
```

#### Make a GET request
```bash
agas @get https://api.example.com/users
```

#### Make a POST request with data
```bash
agas @post https://api.example.com/users -d '{"name":"John Doe"}'
```

### Options in Detail

| Option | Short | Description | Example |
|--------|-------|-------------|---------|
| `--header` | `-H` | Add HTTP header | `-H "Authorization: Bearer token123"` |
| `--data` | `-d` | Request body data | `-d '{"name":"John"}'` |
| `--type` | `-t` | Content type | `-t json` |
| `--params` | `-p` | URL parameters as JSON | `-p '{"page":1,"limit":10}'` |
| `--verbose` | | Show detailed output | `--verbose` |
| `--silent` | | Show only response body | `--silent` |
| `--format` | | Output format | `--format json` |

#### Header Option (`-H`, `--header`)
Add HTTP headers to your request:

```bash
agas @get https://api.example.com/users -H "Authorization: Bearer token123" -H "Accept: application/json"
```

#### Data Option (`-d`, `--data`)
Send data in the request body (for POST, PUT, PATCH):

```bash
agas @post https://api.example.com/users -d '{"name":"John Doe","email":"john@example.com"}'
```

#### Content Type Option (`-t`, `--type`)
Specify the content type of your request:

```bash
agas @post https://api.example.com/users -t json -d '{"name":"John"}'
```

Supported types:
- `json` - application/json
- `html` - text/html
- `text` - text/plain

#### Parameters Option (`-p`, `--params`)
Add URL query parameters:

```bash
agas @get https://api.example.com/search -p '{"q":"javascript","sort":"recent"}'
```

This will construct the URL as: `https://api.example.com/search?q=javascript&sort=recent`

#### Verbose Output (`--verbose`)
Show detailed request and response information:

```bash
agas @get https://api.example.com/users --verbose
```

#### Silent Mode (`--silent`)
Output only the response body, useful for piping to other commands:

```bash
agas @get https://api.example.com/users --silent | jq '.data[0]'
```

#### Output Format (`--format`)
Control how the response body is displayed:

```bash
agas @get https://api.example.com/users --format json
```

Supported formats:
- `json` - Format JSON responses with indentation
- `raw` - Output raw response body

### CLI Examples

#### Basic GET request with headers
```bash
agas @get https://api.example.com/users -H "Authorization: Bearer token123"
```

#### POST request with JSON body
```bash
agas @post https://api.example.com/users -d '{"name":"John Doe","email":"john@example.com"}'
```

#### GET request with URL parameters
```bash
agas @get https://api.example.com/search -p '{"q":"typescript","page":1,"limit":25}'
```

#### PUT request with custom content type
```bash
agas @put https://api.example.com/documents/123 -t text -d "This is a plain text document"
```

#### DELETE request with authentication
```bash
agas @delete https://api.example.com/users/123 -H "Authorization: Bearer token123"
```

#### Silent output for scripting
```bash
user_id=$(agas @get https://api.example.com/me --silent | jq -r '.id')
echo "Current user ID: $user_id"
```

## JavaScript/TypeScript API

### Making Requests

First, import the `Agas` class and create a client instance:

```typescript
import { Agas } from '@medishn/agas';

const client = new Agas();
```

#### GET Request
```typescript
const response = await client.get('https://api.example.com/users');
console.log(response.data); // Parsed response body
```

#### POST Request
```typescript
const response = await client.post(
  'https://api.example.com/users',
  { name: 'John Doe', email: 'john@example.com' }
);
```

#### Request with Headers
```typescript
const response = await client.get('https://api.example.com/users', {
  headers: {
    'Authorization': 'Bearer token123',
    'Accept': 'application/json'
  }
});
```

#### Request with URL Parameters
```typescript
const response = await client.get('https://api.example.com/search', {
  params: {
    q: 'typescript',
    page: 1,
    limit: 25
  }
});
```

#### Using the Generic Request Method
```typescript
const response = await client.request('https://api.example.com/users', {
  method: RequestMethod.POST,
  headers: {
    'Authorization': 'Bearer token123'
  },
  body: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  timeout: 5000
});
```

### Working with Response Data

The response object contains a variety of useful properties:

```typescript
const response = await client.get('https://api.example.com/users');

// Status code and status text
console.log(`Status: ${response.status} ${response.statusText}`);

// Response headers
console.log('Content-Type:', response.headers['content-type']);

// Response body (parsed according to content type)
console.log('Data:', response.data);

// Response timing
console.log(`Request took ${response.duration}ms`);

// Original Response object
const raw = response.response;
```

### Error Handling

Agas can handle errors in several ways:

```typescript
try {
  const response = await client.get('https://api.example.com/invalid');
} catch (error) {
  console.error('Request failed:', error.message);

  // Access context information
  if (error.context) {
    console.error('Request ID:', error.context.requestId);
    console.error('URL:', error.context.url);
    console.error('Method:', error.context.method);
  }
}
```

### Event System

Agas has an event system that allows you to monitor and respond to request lifecycle events:

```typescript
// Listen for request start
client.onRequest((data) => {
  console.log(`Request started: ${data.method} ${data.url}`);
  console.log('Headers:', data.headers);
  console.log('Body:', data.body);
});

// Listen for response
client.onResponse((data) => {
  console.log(`Response received: ${data.status}`);
  console.log(`Response time: ${data.duration}ms`);
});

// Listen for errors
client.onError((data) => {
  console.error(`Request error: ${data.error.message}`);
});

// Make requests as normal
const response = await client.get('https://api.example.com/users');
```

### Advanced Configuration

Agas supports a variety of configuration options:

#### Setting Timeouts
```typescript
const response = await client.get('https://api.example.com/users', {
  timeout: 5000 // 5 seconds
});
```

#### Custom Response Parsing
```typescript
// Skip automatic parsing
const response = await client.get('https://api.example.com/users', {
  parseResponse: false
});

// Force a specific parse type
const response = await client.get('https://api.example.com/users', {
  responseType: 'text' // Force text response
});
```

#### Redirect Handling
```typescript
const response = await client.get('https://api.example.com/users', {
  followRedirects: false // Don't follow redirects
});
```

#### Credentials and Security
```typescript
const response = await client.get('https://api.example.com/users', {
  credentials: 'include', // Include cookies for cross-origin requests
  allowInsecure: true // Allow insecure connections (not recommended for production)
});
```

## Use Cases

### API Testing

Agas is excellent for testing APIs from the command line:

```bash
# Test a REST API endpoint
agas @get https://api.example.com/users --verbose

# Create a new resource
agas @post https://api.example.com/products -d '{"name":"New Product","price":29.99}'

# Check authentication
agas @get https://api.example.com/me -H "Authorization: Bearer $TOKEN"
```

### Backend Health Checks

Monitor service health:

```bash
#!/usr/bin/env bun
import { Agas } from '@medishn/agas';

const client = new Agas();
const services = [
  'https://api.example.com/health',
  'https://auth.example.com/health',
  'https://db.example.com/health'
];

async function checkHealth() {
  for (const url of services) {
    try {
      const response = await client.get(url, { timeout: 3000 });
      console.log(`✅ ${url}: ${response.status} (${response.duration}ms)`);
    } catch (error) {
      console.error(`❌ ${url}: ${error.message}`);
    }
  }
}

checkHealth();
```

### Data Fetching Scripts

Create scripts to fetch and process data:

```typescript
import { Agas } from '@medishn/agas';
import { writeFile } from 'fs/promises';

const client = new Agas();

async function fetchAndSaveUserData() {
  const response = await client.get('https://api.example.com/users', {
    params: { limit: 1000 }
  });

  const users = response.data;

  // Process the data
  const processedData = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email
  }));

  // Save to file
  await writeFile(
    'users.json',
    JSON.stringify(processedData, null, 2)
  );

  console.log(`Saved ${processedData.length} users to users.json`);
}

fetchAndSaveUserData().catch(console.error);
```

## Best Practices

### 1. Set Appropriate Timeouts

Configure timeouts based on the expected response time of the API:

```typescript
// Quick local API
client.get('http://localhost:3000/data', { timeout: 1000 });

// Potentially slower external API
client.get('https://external-api.com/data', { timeout: 10000 });
```

### 2. Handle Rate Limits with Events

Use the event system to track rate limits:

```typescript
let rateLimitRemaining = Infinity;

client.onResponse((data) => {
  const headers = data.headers;
  if (headers['x-rate-limit-remaining']) {
    rateLimitRemaining = parseInt(headers['x-rate-limit-remaining']);
  }
});

async function fetchWithRateLimit(url) {
  if (rateLimitRemaining < 5) {
    console.warn('Approaching rate limit, waiting...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  return client.get(url);
}
```

### 3. Use Request IDs for Tracking

For applications making many parallel requests, track them with request IDs:

```typescript
const response = await client.get('https://api.example.com/data', {
  requestId: 'fetch-user-data-' + Date.now()
});
```

### 4. Set Appropriate Content-Type Headers

Explicitly set content types when sending data:

```typescript
const response = await client.post('https://api.example.com/users', userData, {
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## Troubleshooting

### Common Issues and Solutions

#### Request Timeout

**Problem**: The request is timing out.

**Solution**: Increase the timeout value:
```typescript
await client.get('https://api.example.com/data', { timeout: 30000 }); // 30 seconds
```

#### CORS Errors in Browser

**Problem**: CORS errors when using Agas in browser environments.

**Solution**: Set appropriate credentials and headers:
```typescript
await client.get('https://api.example.com/data', {
  credentials: 'include',
  headers: {
    'Origin': window.location.origin
  }
});
```

#### "Invalid JSON" Errors

**Problem**: Error parsing JSON response.

**Solution**: Force response type to text if the API is returning malformed JSON:
```typescript
const response = await client.get('https://api.example.com/data', {
  responseType: 'text'
});
const data = JSON.parse(response.data.trim());
```

#### Large Response Bodies

**Problem**: Memory issues with large responses.

**Solution**: Consider turning off automatic parsing for large responses:
```typescript
const response = await client.get('https://api.example.com/large-data', {
  parseResponse: false
});
// Process the response stream manually
const reader = response.response.body.getReader();
```

## Reference

### Request Methods

Agas supports the following HTTP methods:

- `GET`: Retrieve resources
- `POST`: Create resources or submit data
- `PUT`: Update resources by replacing them
- `DELETE`: Remove resources
- `PATCH`: Update resources partially
- `HEAD`: Retrieve headers only
- `OPTIONS`: Retrieve supported methods
- And other less common methods: `SEARCH`, `PROPFIND`, `PROPPATCH`, `MKCOL`, `COPY`, `MOVE`, `LOCK`, `UNLOCK`

### Response Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique request identifier |
| `status` | number | HTTP status code |
| `statusText` | string | HTTP status text |
| `headers` | object | Response headers |
| `data` | any | Parsed response body |
| `duration` | number | Request duration in milliseconds |
| `ok` | boolean | Whether status is in the 200-299 range |
| `redirected` | boolean | Whether request was redirected |
| `url` | string | Final URL (after redirects) |
| `type` | string | Response content type |
| `response` | Response | Original Response object |

### Event Types

#### Request Event
Triggered when a request is initiated:

```typescript
client.onRequest((data) => {
  // data contains:
  // - id: string
  // - method: string
  // - url: string
  // - headers?: Record<string, string>
  // - body?: string
  // - start: number (timestamp)
});
```

#### Response Event
Triggered when a response is received:

```typescript
client.onResponse((data) => {
  // data contains:
  // - id: string
  // - status: number
  // - body: string
  // - duration: number
});
```

#### Error Event
Triggered when a request fails:

```typescript
client.onError((data) => {
  // data contains:
  // - id: string
  // - error: Error
});
```

---

For more information, examples, or to report issues, please visit the [GitHub repository](https://github.com/m-mdy-m/agas).
