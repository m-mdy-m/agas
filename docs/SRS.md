# **Software Requirements Specification (SRS) for Agas**

## **Table of Contents**

1. [Introduction](#1-introduction)  
   1.1 [Purpose](#11-purpose)  
   1.2 [Scope](#12-scope)  
   1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)  
   1.4 [References](#14-references)  
   
2. [Overall Description](#2-overall-description)  
   2.1 [Product Perspective](#21-product-perspective)  
   2.2 [Product Functions](#22-product-functions)  
   2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)  
   2.4 [Operating Environment](#24-operating-environment)  
   2.5 [Design and Implementation Constraints](#25-design-and-implementation-constraints)  
   2.6 [Assumptions and Dependencies](#26-assumptions-and-dependencies)  
   
3. [System Features](#3-system-features)  
   3.1 [HTTP Request Management](#31-http-request-management)  
   3.2 [Response Management](#32-response-management)  
   3.3 [Preset Management](#33-preset-management)  
   3.4 [Interactive Mode](#34-interactive-mode)  
   
4. [External Interface Requirements](#4-external-interface-requirements)  
   4.1 [User Interfaces](#41-user-interfaces)  
   4.2 [Hardware Interfaces](#42-hardware-interfaces)  
   4.3 [Software Interfaces](#43-software-interfaces)  
   4.4 [Communication Interfaces](#44-communication-interfaces)  
   
5. [System Attributes](#5-system-attributes)  
   5.1 [Performance Requirements](#51-performance-requirements)  
   5.2 [Security Requirements](#52-security-requirements)  
   5.3 [Usability Requirements](#53-usability-requirements)  
   5.4 [Reliability Requirements](#54-reliability-requirements)  
   5.5 [Portability Requirements](#55-portability-requirements)  
   
6. [Other Non-functional Requirements](#6-other-non-functional-requirements)  

---

## 1. **Introduction**

### 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) is to define the functional and non-functional requirements of the `agas` project. This document outlines the necessary features and behaviors of the `agas` CLI tool, designed to send HTTP requests and process responses from the terminal. It serves as a guide for developers, testers, and stakeholders to understand the capabilities of the tool.

### 1.2 Scope
`Agas` is a CLI-based HTTP request tool, offering similar functionality to Postman but optimized for command-line usage. It supports all major HTTP methods (GET, POST, PUT, DELETE, PATCH), manages request headers and data, and offers features like response formatting, preset management, and an interactive mode for easy request creation. The tool also provides advanced features like short flags, verbose/silent modes, and response formatting options for different content types.

This SRS focuses on the technical and functional aspects of the `agas` tool, defining its core features, usage scenarios, and interface requirements.

### 1.3 Definitions, Acronyms, and Abbreviations
- **CLI**: Command Line Interface.
- **HTTP**: HyperText Transfer Protocol.
- **REST**: Representational State Transfer, a style of software architecture for distributed systems.
- **API**: Application Programming Interface.
- **JSON**: JavaScript Object Notation, a lightweight data-interchange format.
- **GET, POST, PUT, DELETE, PATCH**: HTTP methods used to communicate with APIs.
- **Agas**: The project name, which is a CLI HTTP request tool.
- **Preset**: A saved HTTP request configuration that can be reused.

### 1.4 References
- [Postman Documentation](https://www.postman.com)
- [Curl Documentation](https://curl.se/docs/)
- [jq JSON Processor](https://stedolan.github.io/jq/)

---

## 2. **Overall Description**

### 2.1 Product Perspective
`Agas` is positioned as a CLI-based alternative to GUI tools like Postman. The tool focuses on simplicity and ease of use, targeting developers and system administrators who prefer working in the terminal. It can be integrated into automation scripts, CI/CD pipelines, and used interactively to test APIs quickly.

The tool is built on top of standard utilities like `curl` for HTTP requests and `jq` for response formatting. It provides a layer of convenience through presets, autocompletion, and interactive request generation.

### 2.2 Product Functions
`Agas` provides the following core functionalities:
- Support for common HTTP methods: GET, POST, PUT, DELETE, PATCH.
- The ability to specify headers, query parameters, and request bodies.
- Response management, including formatting (JSON, plain text, HTML).
- Preset management to save and reuse commonly used requests.
- An interactive mode for guiding users through request creation.
- Response verbosity control (`--verbose` and `--silent`).
- Autocomplete for common flags and request parts.
  
### 2.3 User Classes and Characteristics
The users of `agas` fall into two primary categories:
- **Developers**: Primarily working with APIs and HTTP requests during application development.
- **System Administrators / DevOps Engineers**: Using HTTP requests for server health checks, monitoring, or automation scripts.

### 2.4 Operating Environment
The tool operates in a terminal environment on Unix-like systems (Linux, macOS) and Windows. It requires:
- Bash or equivalent shell.
- `curl` for HTTP request handling.
- `jq` for response formatting (optional but recommended).
- Node.js environment for installation and execution (in case it's packaged with Node.js).

### 2.5 Design and Implementation Constraints
- The tool is designed to be run in a terminal/command-line interface.
- Dependency on external utilities such as `curl` and `jq` for core operations.
- Must be compatible with major operating systems (Linux, macOS, Windows).
  
### 2.6 Assumptions and Dependencies
- The user has a basic understanding of HTTP methods and command-line usage.
- Internet connectivity is required for executing most API requests.
- Optional dependencies like `jq` should be installed for response formatting.

---

## 3. **System Features**

### 3.1 HTTP Request Management
The primary feature of `agas` is managing HTTP requests.

#### Description
The tool allows users to send HTTP requests to APIs and web services. It supports all standard HTTP methods (GET, POST, PUT, DELETE, PATCH). Users can define custom headers, URL parameters, and data payloads for their requests.

#### Functional Requirements
- Users must be able to send HTTP requests using the following methods: GET, POST, PUT, DELETE, PATCH.
- The tool must allow the addition of custom headers using the `-H` or `--header` flag.
- The tool must support sending data in POST or PUT requests using the `-d` or `--data` flag.

### 3.2 Response Management
The tool must handle the responses returned by the server.

#### Description
Once a request is made, `agas` handles the response by displaying it in a readable format. It supports output formatting based on the content type, including pretty-printing for JSON responses.

#### Functional Requirements
- Responses must be displayed in the terminal.
- JSON responses must be formatted using `jq`.
- Options for verbose or silent output (`--verbose`, `--silent`) must be available.
  
### 3.3 Preset Management
The tool allows users to save and reuse request configurations.

#### Description
Users can save their request configurations (method, URL, headers, data) as presets and reload them later.

#### Functional Requirements
- Presets must be saved using the `--save` flag with a custom name.
- Saved presets must be loaded using the `--preset` flag with the preset name.
  
### 3.4 Interactive Mode
An interactive mode for simplified user interaction.

#### Description
In this mode, users are guided step-by-step to build their HTTP request by answering prompts. This mode is suitable for beginners or those unfamiliar with HTTP requests.

#### Functional Requirements
- Interactive mode must be initiated with the `--interactive` flag.
- The tool must prompt users for the HTTP method, URL, headers, and data in a step-by-step manner.
  
---

## 4. **External Interface Requirements**

### 4.1 User Interfaces
- Terminal-based command-line interface with support for `bash`, `zsh`, and Windows command prompt/PowerShell.
  
### 4.2 Hardware Interfaces
No specific hardware interfaces are required.

### 4.3 Software Interfaces
- `curl` for sending HTTP requests.
- `jq` for formatting JSON responses.
  
### 4.4 Communication Interfaces
- Communicates over the internet using standard HTTP/HTTPS protocols.
  
---

## 5. **System Attributes**

### 5.1 Performance Requirements
- `Agas` must be able to handle multiple requests per second.
- The response time should be minimal, dependent only on network latency and API response times.

### 5.2 Security Requirements
- No sensitive information (like credentials) should be stored or exposed inappropriately.
- Secure handling of request data and responses.

### 5.3 Usability Requirements
- Command-line arguments and options must be intuitive and well-documented.
- Error messages should be clear and guide users towards resolution.

### 5.4 Reliability Requirements
- The tool should handle unexpected input gracefully and provide informative error messages.
- Must work consistently across supported operating systems.

### 5.5 Portability Requirements
- Should be compatible with Unix-like systems and Windows.
- Installation process must be straightforward, ideally through package managers or direct binary download.

---

## 6. **Other Non-functional Requirements**

- **Documentation**: Comprehensive documentation should be provided, including a user guide and developer guide.
- **Testing**: The tool must be thoroughly tested for different use cases and edge cases.
- **Maintenance**: Regular updates and bug fixes should be provided to address issues and add new features as needed.

---