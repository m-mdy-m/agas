# Software Requirements Specification (SRS) for Agas

## Introduction

### Purpose

The purpose of `Agas` is to provide a command-line tool for making HTTP requests with a range of customization options. It supports various HTTP methods and features for handling headers, data payloads, and output formatting.

### Scope

`Agas` will be a terminal-based tool that enables users to send HTTP requests and manage responses. It is designed to be easy to use and highly customizable, with support for Docker deployment and manual installation.

### Definitions

- **HTTP Methods**: Types of requests made to a server, such as GET, POST, PUT, DELETE.
- **Headers**: Metadata sent along with the request, such as content type or authentication tokens.
- **Payload**: Data sent with the request, typically in JSON or form data.

## Functional Requirements

### HTTP Methods

1. **GET**: Retrieve data from a server.
2. **POST**: Send data to a server.
3. **PUT**: Update data on a server.
4. **DELETE**: Remove data from a server.

### Headers

1. **Custom Headers**: Users can add custom headers using the `-H` or `--header` option.
2. **Content-Type**: Specify the type of content being sent, such as `application/json`.

### Data Payload

1. **JSON**: Send data in JSON format using the `-d` or `--data` option.
2. **Form Data**: Send data in application/x-www-form-urlencoded format.

### Output Formatting

1. **Raw Output**: Display raw response data.
2. **Formatted Output**: Use `jq` to format JSON responses.

### Docker Support

1. **Build Docker Image**: Create a Docker image for easy deployment.
2. **Run Docker Container**: Execute the tool in a Docker container.

### Manual Installation

1. **Dependencies**: Install required dependencies, including bash and curl.
2. **Script Installation**: Install the `agas` script to a system-wide location.

## Non-Functional Requirements

### Performance

1. **Efficiency**: The tool should handle HTTP requests promptly without significant delays.

### Usability

1. **Ease of Use**: The tool should be intuitive and easy to use from the command line.
2. **Documentation**: Comprehensive documentation should be available for users.

### Reliability

1. **Error Handling**: The tool should handle errors gracefully and provide meaningful error messages.

### Security

1. **Secure Handling**: Ensure that sensitive information is handled securely and avoid hardcoding secrets.

## External Interface Requirements

### User Interfaces

1. **Command Line Interface (CLI)**: The primary interface for users to interact with `Agas`.

### Hardware Interfaces

1. **System Requirements**: The tool should be compatible with standard hardware running Linux or similar operating systems.

### Software Interfaces

1. **Docker**: Support for Docker for containerized deployment.
2. **Dependencies**: Requires bash and curl for manual installation.

## Design Constraints

1. **Compatibility**: The tool should be compatible with Unix-like operating systems.
2. **Resource Usage**: Should be lightweight and not consume excessive system resources.

## Appendices

### References

- [Semantic Versioning](https://semver.org/)
- [Contributor Covenant](https://www.contributor-covenant.org)

### Glossary

- **CLI**: Command Line Interface
- **JSON**: JavaScript Object Notation
- **Docker**: Containerization platform