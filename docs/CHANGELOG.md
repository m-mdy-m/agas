# Changelog

All notable changes to Agas will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-alpha] - 2024-04-21

### Added

- Initial release of Agas, a minimal, CLI-friendly HTTP client powered by Bun
- Core HTTP client functionality with support for all standard HTTP methods:
  - GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
  - Additional support for less common methods: SEARCH, PROPFIND, PROPPATCH, MKCOL, COPY, MOVE, LOCK, UNLOCK
- Event-driven architecture using `@glandjs/events` broker system
  - Event subscriptions for request start, response received, and error events
  - Detailed event data with request/response metrics
- Comprehensive CLI interface with colored output
  - Interactive command prompts with spinner indicators
  - Support for JSON formatting and pretty-printing
  - Support for silent mode (returns only response body)
  - Support for verbose mode (includes detailed headers and request info)
- Advanced request options:
  - Custom headers and content types
  - Body data in multiple formats (JSON, FormData, raw text)
  - URL parameter handling
  - Request timeouts
  - Response type specification (auto, json, text, blob, arrayBuffer, formData)
  - Redirect handling (follow/manual)
  - Security settings (allow insecure connections)
  - Compression options
  - Credentials handling (CORS)
- Response handling:
  - Automatic content-type detection
  - Response parsing based on content type
  - Rich response object with metadata (status, headers, timing, etc.)
- Docker support for containerized execution
- Enhanced error handling with context information
- Complete TypeScript definitions for all interfaces
- Developer-friendly utilities:
  - Colored terminal output
  - Animated spinners for progress indication
  - Type-safe event system

### Developer Notes

- Built using Bun runtime for maximum performance
- TypeScript for type safety throughout the codebase
- Modular architecture for extensibility
- Event-driven by design for easy integration with other systems
- Minimal dependencies, focused on performance and reliability
- CLI experience designed for developers with readable output formats
- Docker image based on Alpine for minimal footprint

### Infrastructure

- Docker configuration with proper security practices
  - Non-root user setup (appuser)
  - Alpine-based image for minimal attack surface
  - Proper permissions setup
- Build system for both library and CLI usage
  - ESM module format
  - Minified builds for production
- GitHub repository setup with issue templates

### Known Issues

- Limited file upload capabilities in the current version
- No built-in persistent cookie jar
- No built-in session management
