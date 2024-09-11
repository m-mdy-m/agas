# Agas

`Agas` is a command-line HTTP request tool designed to handle HTTP requests with various customization options. It supports methods such as GET, POST, PUT, and DELETE, along with custom headers and data payloads. The tool is packaged with Docker for easy deployment.

## Features

- **HTTP Methods**: GET, POST, PUT, DELETE
- **Custom Headers**: Use `-H` or `--header`
- **Data Payload**: Use `-d` or `--data`
- **Content Type**: JSON, HTML, Text
- **Output Formatting**: Raw or JSON (using `jq`)
- **Verbose and Silent Modes**

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

4. **Install Script** (optional ->(manual install)):
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

To use `Agas`, run it from the terminal with the desired HTTP method and options. For example:

### Step One:

```
agas
```

### Step Two
```sh
agas @get https://api.example.com/resource -H "Accept: application/json" -t json 
```

## Contributing

Please read our [Contributing Guidelines](/docs/CONTRIBUTING.md) before making contributions.

## Code of Conduct

We expect all contributors to follow our [Code of Conduct](/docs/CODE_OF_CONDUCT.md).

## Changelog

See our [Changelog](/docs/CHANGELOG.md) for a list of changes and updates.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.