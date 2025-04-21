# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.0-alpha   | :white_check_mark: |

## Security Considerations for Agas

Agas is designed to be a minimal HTTP client. As with any tool that handles network requests, there are important security considerations to keep in mind:

### Network Security

1. **TLS/SSL Verification**: By default, Agas verifies SSL certificates. The `allowInsecure` option should only be used in development environments or specific controlled situations.

2. **Data Transmission**: Be careful when transmitting sensitive data. Agas will send the data as specified, so ensure you're using encrypted connections (HTTPS) when handling sensitive information.

3. **Authentication Credentials**: When using authentication headers or credentials, be aware that these are handled according to the options specified. Use appropriate credential policies based on your security requirements.

### Input Validation

1. **URL Parameters**: While Agas handles URL encoding, you should validate URLs and parameters before passing them to Agas to prevent injection attacks or unintended behavior.

2. **Request Bodies**: Validate and sanitize data before including it in request bodies, especially when accepting user input.

### Docker Security

If using the Docker image:

1. The image runs as a non-root user (`appuser`) to limit potential damage from container breakouts.
2. The image is based on Alpine to minimize the attack surface.
3. Only required files and binaries are included in the image.

### CLI Usage

When using Agas CLI:

1. Be cautious when using the `--data` flag with sensitive information as command-line arguments may be visible in process listings or shell history.
2. Consider using environment variables or configuration files for sensitive data instead of command line arguments.

## Reporting a Vulnerability

We take the security of Agas seriously. If you believe you've found a security vulnerability, please follow these steps:

1. **Do not disclose the vulnerability publicly** or to any third parties.
2. Email details of the vulnerability to [bitsgenix@gmail.com](mailto:bitsgenix@gmail.com) with "[SECURITY]" in the subject line.
3. Include the following information:
   - A description of the vulnerability
   - Steps to reproduce it
   - Potential impact
   - Suggestions for mitigation if you have any

The maintainers will acknowledge receipt of your vulnerability report as soon as possible, usually within 48 hours. We will then:

1. Confirm the vulnerability and determine its impact
2. Develop and test a fix
3. Release a security update
4. Publicly acknowledge your responsible disclosure after the fix is released

## Security Best Practices When Using Agas

1. **Keep Agas updated** to the latest version to benefit from security fixes.

2. **Review HTTP request configurations** to ensure they follow security best practices:
   - Use HTTPS where possible
   - Set appropriate timeouts to prevent DoS situations
   - Validate all inputs before sending them

3. **Handle response data carefully** to prevent security issues in your application:
   - Validate response data before processing or storing it
   - Be aware of potential XSS or injection risks when displaying response data

4. **Use error events** to detect and handle potential security issues:
   - Subscribe to error events to get notifications of request failures
   - Implement proper error handling to prevent information disclosure

5. **Secure your API keys and credentials**:
   - Never hardcode sensitive data in your application
   - Use environment variables or secure credential stores
   - Be careful with request/response logging that might expose sensitive data

## Protocol-Specific Security Considerations

When using different HTTP methods with Agas, be aware of their security implications:

- **GET**: Should be used for read-only operations; avoid sending sensitive data in URL parameters
- **POST/PUT/PATCH**: Use for operations that modify data; ensure proper authorization
- **DELETE**: Ensure proper access controls before deleting resources
- **HEAD/OPTIONS**: Can leak information about your API; ensure they only return appropriate metadata

## Dependencies

Agas has minimal dependencies to reduce potential security vulnerabilities:
- `@glandjs/common`
- `@glandjs/events`
- `@medishn/toolkit`

We regularly monitor these dependencies for security issues and update them as needed.