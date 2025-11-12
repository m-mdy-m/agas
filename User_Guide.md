# Agas User Guide

**Version 2.0.2**

## What is Agas?

Agas is a fast and simple HTTP client that works both from the command line and in your JavaScript code. It's built with Bun, which makes it really quick, and it's designed to be easy to use whether you're testing APIs or building applications.

Think of it as a tool that helps you talk to websites and APIs. You can send requests, get responses, and work with data without writing much code.

## Installing Agas

You have several ways to install Agas. Pick the one that works best for you.

### Using a Package Manager

If you use npm, yarn, or bun for managing your JavaScript projects:

```bash
# With npm (install globally to use from anywhere)
npm install -g @medishn/agas

# With yarn
yarn global add @medishn/agas

# With bun
bun install -g @medishn/agas
```

After installing, you can run `agas` from any directory in your terminal.

### Using the Install Script

This is the easiest way if you just want to download and use Agas:

**On Linux or Mac:**
```bash
curl -fsSL https://raw.githubusercontent.com/m-mdy-m/agas/main/scripts/install.sh | sh
```

**On Windows:**
```powershell
irm https://raw.githubusercontent.com/m-mdy-m/agas/main/scripts/install.ps1 | iex
```

The script will:
- Figure out your operating system and processor type
- Download the right version for your computer
- Put it in a folder on your system
- Make sure you can run it from anywhere

### Using Docker

If you prefer containers or don't want to install anything directly:

```bash
# Download the image
docker pull bitsgenix/agas:latest

# Use it
docker run --rm bitsgenix/agas get https://api.github.com
```

### Checking Your Installation

After installing, make sure it works:

```bash
agas --version
```

You should see something like "agas version 2.0.2".

## Using Agas from the Command Line

The command line interface is where Agas really shines. You can make HTTP requests with just a few words.

### Basic Pattern

Most commands follow this pattern:

```bash
agas <method> <url> [options]
```

For example:
```bash
agas get https://api.example.com/users
```

If you don't specify a method, it assumes you want GET:
```bash
agas https://api.example.com/users
```

### Making Different Types of Requests

**GET - Getting Data**

This is for reading information from a server:

```bash
agas get https://api.example.com/users
```

**POST - Sending New Data**

Use this when you want to create something new:

```bash
agas post https://api.example.com/users -d '{"name":"Alice","email":"alice@example.com"}'
```

**PUT - Updating Data**

This replaces existing data:

```bash
agas put https://api.example.com/users/123 -d '{"name":"Alice Smith"}'
```

**PATCH - Partial Updates**

When you only want to change part of something:

```bash
agas patch https://api.example.com/users/123 --json name="Alice Smith"
```

**DELETE - Removing Data**

To delete something:

```bash
agas delete https://api.example.com/users/123
```

### Working with Headers

Headers are extra information you send with your request. They're often used for authentication or telling the server what kind of data you're sending.

```bash
# Add one header
agas get https://api.example.com/users -H "Authorization: Bearer your-token-here"

# Add multiple headers
agas get https://api.example.com/users \
  -H "Authorization: Bearer token" \
  -H "Accept: application/json"
```

### Sending Data

There are several ways to send data with your request:

**JSON Data (the most common)**

```bash
# Send a complete JSON object
agas post https://api.example.com/users -d '{"name":"Alice","age":30}'

# Build JSON field by field
agas post https://api.example.com/users --json name=Alice --json age=30
```

**Form Data**

Some APIs expect form-style data:

```bash
agas post https://api.example.com/login --form username=alice --form password=secret
```

### Adding Query Parameters

Query parameters are the part of the URL after the question mark. Instead of building them yourself, let Agas do it:

```bash
agas get https://api.example.com/search -q term=javascript -q limit=10
```

This creates: `https://api.example.com/search?term=javascript&limit=10`

### Controlling Output

**Pretty Printing**

Make JSON responses easier to read:

```bash
agas get https://api.example.com/users --pretty
```

**Table View**

If you get a list of items, display them as a table:

```bash
agas get https://api.example.com/users --table
```

**Verbose Mode**

See all the details about your request and response:

```bash
agas get https://api.example.com/users --verbose
```

**Silent Mode**

Only show the response body, nothing else:

```bash
agas get https://api.example.com/users --silent
```

This is useful when you want to pipe the output to another program:

```bash
agas get https://api.example.com/users --silent | jq '.[] | .name'
```

### Saving Responses to Files

Sometimes you want to keep the response:

```bash
agas get https://api.example.com/users -o users.json
```

### Setting Timeouts

If a request is taking too long, you can set a maximum wait time (in milliseconds):

```bash
agas get https://slow-api.example.com --timeout 5000
```

This waits up to 5 seconds before giving up.

### Saving and Reusing Requests

If you make the same request often, save it and run it later:

```bash
# Save a request
agas post https://api.example.com/users \
  --json name=Alice \
  --save create-user

# Run it later
agas run create-user
```

You can manage your saved requests:

```bash
# List all saved requests
agas requests list

# Delete a saved request
agas requests delete create-user
```

### Viewing Request History

Agas keeps track of the requests you make:

```bash
# See recent requests
agas history

# Clear the history
agas history clear
```

### Configuration

You can set defaults so you don't have to type them every time:

```bash
# Set a base URL
agas config set baseURL https://api.example.com

# Set a default timeout
agas config set timeout 10000

# See all your config
agas config list

# Get one specific value
agas config get baseURL
```

## Using Agas in Your Code

Besides the command line, you can use Agas in your JavaScript or TypeScript projects.

### Getting Started

First, import Agas:

```javascript
import { Agas } from '@medishn/agas';

// Create a client
const client = new Agas();
```

### Making Requests

**Simple GET Request**

```javascript
const response = await client.get('https://api.example.com/users');
console.log(response.data); // The actual data from the server
console.log(response.status); // Like 200, 404, etc.
```

**POST Request with Data**

```javascript
const newUser = {
  name: 'Alice',
  email: 'alice@example.com'
};

const response = await client.post('https://api.example.com/users', newUser);
console.log(response.data); // The server's response
```

**Request with Headers**

```javascript
const response = await client.get('https://api.example.com/users', {
  headers: {
    'Authorization': 'Bearer your-token-here'
  }
});
```

**Request with Query Parameters**

```javascript
const response = await client.get('https://api.example.com/search', {
  params: {
    q: 'javascript',
    limit: 10
  }
});
```

### Setting Up a Client with Defaults

Instead of repeating the same settings, create a client with defaults:

```javascript
const client = new Agas({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer your-token-here',
    'Content-Type': 'application/json'
  }
});

// Now you can make requests without repeating those settings
const response = await client.get('/users');
```

### Understanding Responses

When you make a request, you get back an object with useful information:

```javascript
const response = await client.get('https://api.example.com/users');

// The actual data
console.log(response.data);

// HTTP status code (200, 404, 500, etc.)
console.log(response.status);

// Status message
console.log(response.statusText); // "OK", "Not Found", etc.

// Response headers
console.log(response.headers['content-type']);

// How long it took (in milliseconds)
console.log(response.duration);

// Unique ID for this request
console.log(response.id);
```

### Handling Errors

Things can go wrong - the network might fail, the server might be down, or you might send bad data. Always handle errors:

```javascript
try {
  const response = await client.get('https://api.example.com/users');
  console.log('Success:', response.data);
} catch (error) {
  console.error('Something went wrong:', error.message);
  
  // If the server responded (even with an error)
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  }
}
```

### Using Events

Agas lets you listen for events during the request lifecycle. This is useful for logging, monitoring, or debugging:

```javascript
// Listen when a request starts
client.on('request', (data) => {
  console.log(`Starting ${data.method} request to ${data.url}`);
});

// Listen when a response comes back
client.on('response', (data) => {
  console.log(`Got response with status ${data.status} in ${data.duration}ms`);
});

// Listen for errors
client.on('error', (data) => {
  console.error(`Request failed: ${data.error.message}`);
});

// Make your request as normal
const response = await client.get('https://api.example.com/users');
```

### Interceptors

Interceptors let you modify requests before they're sent or responses before you get them back. This is powerful for things like adding auth tokens or transforming data:

**Request Interceptor**

```javascript
// Add a token to every request
client.interceptors.request.use((config) => {
  config.headers['Authorization'] = 'Bearer ' + getToken();
  return config;
});
```

**Response Interceptor**

```javascript
// Transform all responses
client.interceptors.response.use((response) => {
  // Add a timestamp to every response
  response.data.receivedAt = new Date();
  return response;
});
```

### Advanced Options

**Timeouts**

```javascript
const response = await client.get('https://slow-api.example.com', {
  timeout: 5000 // Wait up to 5 seconds
});
```

**Custom Validation**

By default, Agas treats status codes 200-299 as successful. You can change this:

```javascript
const client = new Agas({
  validateStatus: (status) => {
    // Treat 200-399 as successful
    return status >= 200 && status < 400;
  }
});
```

**Response Types**

Tell Agas what kind of response you expect:

```javascript
// Get response as JSON (default for most APIs)
const response = await client.get('/users', {
  responseType: 'json'
});

// Get response as plain text
const response = await client.get('/document', {
  responseType: 'text'
});

// Let Agas figure it out (default)
const response = await client.get('/data', {
  responseType: 'auto'
});
```

## Common Use Cases

### Testing an API

When you're building or testing an API, Agas makes it easy to send requests:

```bash
# Test a GET endpoint
agas get https://api.example.com/users --verbose

# Test creating a resource
agas post https://api.example.com/users --json name=Test --json email=test@example.com

# Test with authentication
agas get https://api.example.com/protected -H "Authorization: Bearer token123"

# Save common requests
agas post https://api.example.com/users --json name=Test --save test-create
agas run test-create
```

### Checking if Services are Running

Create a simple script to check if your services are healthy:

```javascript
import { Agas } from '@medishn/agas';

const services = [
  'https://api.example.com/health',
  'https://auth.example.com/health',
  'https://db.example.com/health'
];

const client = new Agas({ timeout: 3000 });

for (const url of services) {
  try {
    const response = await client.get(url);
    console.log(`OK: ${url} (${response.duration}ms)`);
  } catch (error) {
    console.error(`FAILED: ${url} - ${error.message}`);
  }
}
```

### Fetching Data for Processing

Get data from an API and process it:

```javascript
import { Agas } from '@medishn/agas';

const client = new Agas();

// Get a list of users
const response = await client.get('https://api.example.com/users', {
  params: { limit: 100 }
});

// Process the data
const emails = response.data.map(user => user.email);

console.log('Found emails:', emails);

// Save to a file
await Bun.write('emails.txt', emails.join('\n'));
```

### Building a Simple API Client

Create a reusable client for your API:

```javascript
import { Agas } from '@medishn/agas';

class MyAPIClient {
  constructor(apiKey) {
    this.client = new Agas({
      baseURL: 'https://api.example.com',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getUsers() {
    const response = await this.client.get('/users');
    return response.data;
  }

  async createUser(userData) {
    const response = await this.client.post('/users', userData);
    return response.data;
  }

  async updateUser(id, userData) {
    const response = await this.client.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id) {
    await this.client.delete(`/users/${id}`);
  }
}

// Use it
const api = new MyAPIClient('your-api-key');
const users = await api.getUsers();
```

## Tips and Best Practices

### Always Handle Errors

Network requests can fail for many reasons. Always wrap your requests in try-catch blocks:

```javascript
try {
  const response = await client.get('/data');
  // Handle success
} catch (error) {
  // Handle error
  console.error('Request failed:', error.message);
}
```

### Set Reasonable Timeouts

Don't let requests hang forever. Set a timeout based on what you expect:

```javascript
// Quick local API
client.get('http://localhost:3000/data', { timeout: 1000 });

// External API that might be slower
client.get('https://external-api.com/data', { timeout: 10000 });
```

### Use Base URLs

If you're making many requests to the same API, set a base URL:

```javascript
const client = new Agas({
  baseURL: 'https://api.example.com'
});

// Now you can use relative paths
await client.get('/users');
await client.get('/posts');
```

### Don't Put Secrets in Your Code

Never hardcode API keys or tokens:

```javascript
// Bad
const client = new Agas({
  headers: {
    'Authorization': 'Bearer abc123secret'
  }
});

// Good - use environment variables
const client = new Agas({
  headers: {
    'Authorization': `Bearer ${process.env.API_KEY}`
  }
});
```

### Use Verbose Mode for Debugging

When something isn't working, use verbose mode to see what's happening:

```bash
agas get https://api.example.com/users --verbose
```

This shows you the request headers, response headers, and other details that help you figure out what's wrong.

## Troubleshooting

### "Command not found"

If you get this error after installing, your PATH might not be set up correctly.

**On Mac or Linux:**
```bash
export PATH="$PATH:$HOME/.local/bin"
```

Add that line to your `~/.bashrc` or `~/.zshrc` file to make it permanent.

**On Windows:**
The installer should handle this, but you might need to restart your terminal or computer.

### Request Timeout

If requests are timing out:

1. Check your internet connection
2. Make sure the URL is correct
3. Try increasing the timeout: `--timeout 30000`
4. Check if there's a firewall blocking the request

### "Invalid JSON"

If you're getting JSON parsing errors:

1. Make sure the API is actually returning JSON
2. Try getting the response as text first: `--responseType text`
3. Check if the API requires specific headers

### SSL Certificate Errors

If you're getting certificate errors with HTTPS:

1. Make sure your system's date and time are correct
2. Update your system's certificate store
3. Only as a last resort for testing: use the allow insecure option (not recommended for production)

## Getting Help

If you need more help:

- Check the documentation: https://github.com/m-mdy-m/agas
- Report bugs or ask questions: https://github.com/m-mdy-m/agas/issues
- Read the changelog for updates: https://github.com/m-mdy-m/agas/blob/main/docs/CHANGELOG.md

## Quick Reference

**Common Commands:**
```bash
agas <url>                              # GET request
agas get <url>                          # Explicit GET
agas post <url> -d '{"key":"value"}'    # POST with data
agas get <url> -H "Key: Value"          # Add header
agas get <url> -q key=value             # Add query param
agas get <url> --pretty                 # Pretty print
agas get <url> --table                  # Table view
agas get <url> -o file.json             # Save to file
agas --save name                        # Save request
agas run name                           # Run saved request
agas history                            # View history
agas config list                        # View config
agas --version                          # Show version
agas --help                             # Show help
```

**Common Options:**
- `-H, --header` - Add header
- `-q, --query` - Add query parameter
- `-d, --data` - Request body
- `--json` - Add JSON field
- `-o, --output` - Save to file
- `--pretty` - Format output
- `-v, --verbose` - Show details
- `--silent` - Only show body
- `--timeout` - Set timeout
- `--table` - Table display
- `--save` - Save request