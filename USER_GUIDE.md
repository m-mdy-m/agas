# User Guide for Agas

## Introduction

`Agas` is a command-line tool designed for making HTTP requests with various customization options. This guide will walk you through installation, basic usage, and examples.

## Installation

### Using Docker

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/m-mdy-m/agas.git
   cd agas
   ```

2. **Build Docker Image**:
   ```sh
   make build
   ```

3. **Run Docker Container**:
   ```sh
   make run
   ```

4. **Install Script** (optional ->(manual install))
   ```sh
   make install
   ```

### Manual Installation

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/m-mdy-m/agas.git
   cd agas
   ```

2. **Install**:
   ```sh
    make install
   ```

## Usage

`Agas` supports various HTTP methods and customization options. Here are some basic usage examples:

### Send a GET Request

To send a GET request to a URL:

```sh
agas @get https://api.example.com/resource
```

### Send a POST Request with JSON Data

To send a POST request with JSON data:

```sh
agas @post https://api.example.com/resource -d '{"key":"value"}' -H "Content-Type: application/json" 
```

### Send a PUT Request with Form Data

To send a PUT request with form data:

```sh
agas @put  https://api.example.com/resource -d "key=value" -H "Content-Type: application/x-www-form-urlencoded" 
```

### Send a DELETE Request

To send a DELETE request:

```sh
agas @delete https://api.example.com/resource
```

### Output Formatting

To format JSON output with `jq`:

```sh
agas @get https://api.example.com/resource | jq .
```

## Examples

### Example 1: Fetch User Info

Fetch user information from a mock API:

```sh
agas @get https://jsonplaceholder.typicode.com/users/1
```

### Example 2: Create a New Post

Create a new post with JSON data:

```sh
agas @post https://jsonplaceholder.typicode.com/posts -d '{"title":"foo","body":"bar","userId":1}' -H "Content-Type: application/json" 
```

### Example 3: Update an Existing Post

Update an existing post:

```sh
agas @put https://jsonplaceholder.typicode.com/posts/1 -d '{"title":"updated title"}' -H "Content-Type: application/json" 
```

### Example 4: Delete a Post

Delete a post:

```sh
agas @delete https://jsonplaceholder.typicode.com/posts/1
```

## Troubleshooting

If you encounter any issues:

- **Check Dependencies**: Ensure all required dependencies are installed.
- **Review Command Syntax**: Verify that the command syntax is correct.
- **Consult Documentation**: Refer to this guide or the [Changelog](/docs/CHANGELOG.md) for updates.

## Contributing

For information on how to contribute to `Agas`, please refer to our [Contributing Guidelines](/docs/CONTRIBUTING.md).

## Contact

For support or to report issues, please contact us at [bitsgenix@gmail.com](mailto:bitsgenix@gmail.com).

Thank you for using `Agas`!