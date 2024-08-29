# Agas (آگاس)

Agas is a command-line tool for sending HTTP requests directly from your terminal. It supports various HTTP methods, allows customization of headers, data payloads, and request types, and provides a simple way to interact with RESTful APIs and GraphQL endpoints.

## Features

- **Supports Multiple HTTP Methods**: GET, POST, PUT, DELETE, PATCH, and custom POST for GraphQL.
- **Customizable Headers**: Add custom headers to your requests.
- **Flexible Data Handling**: Send data as JSON, HTML, or plain text.
- **Easy-to-Use Command-Line Interface**: Simple syntax for quick requests and testing.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/agas.git
   cd agas
   ```

2. **Build the Script**

   Make sure you have `bash` and `curl` installed. If not, install them using your package manager.

   ```bash
   chmod +x agas.sh
   ```

3. **Move to Bin Directory**

   ```bash
   mkdir -p ~/bin
   mv agas.sh ~/bin/agas
   ```

4. **Add to PATH**

   Ensure `~/bin` is in your system's `PATH`. You can add the following line to your `.bashrc` or `.zshrc` file:

   ```bash
   export PATH="$HOME/bin:$PATH"
   ```

   Then, source the file to update your current session:

   ```bash
   source ~/.bashrc  # or ~/.zshrc
   ```

## Usage

The basic syntax for using `agas` is:

```bash
agas @method url [options]
```

### HTTP Methods

- `@get`: Perform a GET request.
- `@post`: Perform a POST request.
- `@put`: Perform a PUT request.
- `@delete`: Perform a DELETE request.
- `@patch`: Perform a PATCH request.
- `@all`: Use for GraphQL or multi-purpose POST requests.

### Options

- `-H, --header`: Add a custom header to the request. Example: `-H 'Authorization: Bearer token'`
- `-d, --data`: Specify the data to be sent with the request. For JSON data, use double quotes around the JSON payload. Example: `-d '{"key":"value"}'`
- `-t, --type`: Set the content type of the request. Options include `json`, `html`, and `text`. Example: `-t json`

### Examples

1. **GET Request**

   ```bash
   agas @get http://localhost:3000/api/users
   ```

2. **POST Request with JSON Data**

   ```bash
   agas @post http://localhost:3000/api/users -t json -d '{"name":"John", "age":30}'
   ```

3. **POST Request with Custom Header**

   ```bash
   agas @post http://localhost:3000/api/users -H 'Authorization: Bearer mytoken' -t json -d '{"name":"John", "age":30}'
   ```

4. **GraphQL Query**

   ```bash
   agas @post http://localhost:3000/graphql -t json -d '{"query":"{ user { id name username } }"}'
   ```

## Script Details

The `agas.sh` script is a Bash script that uses `curl` to perform HTTP requests based on the given parameters. It processes command-line arguments to configure HTTP method, headers, data, and request type. The response is printed to the terminal with an additional newline for readability.

## Troubleshooting

- **Bad Hostname Error**: Ensure the URL is correctly formatted and accessible. Verify your server is running and reachable.
- **Unexpected Options**: Ensure that all options and arguments are correctly provided as per the usage guidelines.
- **Invalid Data Format**: Make sure the data provided with the `-d` option is correctly formatted and escaped.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

If you have suggestions or improvements for `Agas`, feel free to open an issue or submit a pull request on GitHub.

## Contact

For any questions or support, please contact [your email address] or open an issue on the [GitHub repository](https://github.com/yourusername/agas).