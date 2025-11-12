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

## [1.1.0] - 2025-04-25

### Changed

- **Refactored Event System**: Replaced `@glandjs/events` with the lightweight `@glandjs/emitter` to streamline event handling and reduce overhead.
- **Dependency Cleanup**: Removed `@medishn/toolkit` to minimize external dependencies and enhance maintainability.

### Performance Improvements

- **Reduced Package Size**: Optimized the build process, decreasing the package size from approximately 64KB to just 8KB, resulting in faster load times and improved performance.

### Developer Notes

- **Simplified Architecture**: The transition to `@glandjs/emitter` simplifies the event-driven architecture, making it more intuitive and efficient.
- **Lean Build**: By eliminating unnecessary dependencies, the codebase is now leaner, facilitating easier debugging and faster development cycles.


## [2.0.0] - 2025-11-12

### Added

#### CLI
- Complete CLI rewrite with natural syntax
- Table output format for array responses
- Request history tracking
- Save and replay requests
- Configuration management (`agas config`)
- Smart output formatting with syntax highlighting
- Loading spinners and progress indicators
- Multiple input formats (JSON, form, raw)
- Beautiful, color-coded output
- Output to file support

#### API
- Enhanced error handling
- Full TypeScript types
- Automatic response type detection
- Request timing information
- Flexible configuration options

#### Infrastructure
- Optimized Docker image (multi-stage build)
- Better package structure
- Comprehensive test suite
- Complete documentation
- CI/CD with GitHub Actions
- Auto-publish to Docker Hub and NPM

### Changed
- **Breaking**: Removed `@method` syntax in favor of natural `method` syntax
- **Breaking**: Changed package structure and exports
- **Breaking**: Updated configuration format
- Improved error messages with context
- Better request/response formatting
- Enhanced TypeScript definitions

### Removed

- Removed old event system
- Removed deprecated options
- Removed unnecessary dependencies

## [2.0.2] - 2025-11-12

### Added

* New response formatters: JSON and table helpers, and header formatter.
* Minor CLI import cleanup.

### Changed

* Simplified history/saved-request constants.
* Installer script: `verify_checksum` temporarily disabled (installer flow relaxed).

### Fixed

* Defensive checks and optional chaining across core request flow to avoid crashes when config fields are missing.
* Safer response parsing and body serialization handling.
* Corrected interceptor generics and several TypeScript signatures (e.g., `patch` return type).
* Minor import/format fixes in `bin/agas.ts` and formatter modules.

## [2.0.3] - 2025-11-13

### Added
* Add Intro Command with animation

## Changed

* Write better readme and UserGuide