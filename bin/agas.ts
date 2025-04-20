#!/usr/bin/env bun
import { colors, spinner } from '../cli'
import { Agas } from '../dist'
import { RequestMethod } from '../src/common'

const client = new Agas()

const LOGO = `
╭──────╮ ╭────╮ ╭────╮ ╭────╮
│  ▄▀▄ │ │ ▄▀▀│ │ ▄▀▀│ │ ▀▀▄│
│  █ █ │ │ ▀▀▄│ │ ▀▀▄│ │ ▄▄▀│
╰──────╯ ╰────╯ ╰────╯ ╰────╯
         A G A S
`

async function typeEffect(text: string, speed = 30): Promise<void> {
  for (const char of text) {
    process.stdout.write(char)
    await new Promise((resolve) => setTimeout(resolve, speed))
  }
  process.stdout.write('\n')
}

async function displayIntro(): Promise<void> {
  console.clear()

  console.log(colors.blue(LOGO))

  await typeEffect(
    colors.green('===============================================')
  )
  await typeEffect(
    colors.green('|                                              |')
  )
  await typeEffect(
    colors.green('|            Welcome to Agas CLI               |')
  )
  await typeEffect(
    colors.green('|                                              |')
  )
  await typeEffect(
    colors.green('===============================================')
  )

  await typeEffect(colors.cyan('Starting up...'))
  await new Promise((resolve) => setTimeout(resolve, 400))

  await typeEffect(
    colors.yellow('Agas is a minimal HTTP client for the terminal.')
  )
  await typeEffect(colors.yellow('Built with Bun and TypeScript.'))

  await typeEffect(colors.green('\nFeatures:'))
  await typeEffect(colors.white('• Simple and readable syntax'))
  await typeEffect(
    colors.white('• Works well with JSON, FormData, and raw bodies')
  )
  await typeEffect(colors.white('• Event-driven by design'))

  console.log('\n')
  await typeEffect(colors.magenta('Type "agas --help" to get started'))
  console.log('\n')
}

/**
 * Format and display HTTP response
 */
function formatResponse(
  method: string,
  url: string,
  headers: Record<string, string>,
  requestBody: any,
  response: any,
  outputFormat: string = 'json',
  verbose: boolean = false
): void {
  console.log(colors.blue('┌─────────────────────────────────────────┐'))
  console.log(colors.blue('│ REQUEST DETAILS                         │'))
  console.log(colors.blue('└─────────────────────────────────────────┘'))
  console.log(colors.green(`Method:   ${method}`))
  console.log(colors.green(`URL:      ${url}`))

  if (verbose) {
    console.log(colors.green('Headers:'))
    for (const [key, value] of Object.entries(headers)) {
      console.log(colors.green(`  ${key}: ${value}`))
    }

    if (requestBody) {
      console.log(colors.green('Body:'))
      console.log(
        colors.green(
          `  ${
            typeof requestBody === 'object'
              ? JSON.stringify(requestBody, null, 2)
              : requestBody
          }`
        )
      )
    }
  }

  console.log('')
  console.log(colors.blue('┌─────────────────────────────────────────┐'))
  console.log(colors.blue('│ RESPONSE DETAILS                        │'))
  console.log(colors.blue('└─────────────────────────────────────────┘'))
  console.log(
    colors.yellow(`Status:   ${response.status} ${response.statusText}`)
  )
  console.log(colors.yellow(`Time:     ${response.duration.toFixed(2)}ms`))

  if (verbose) {
    console.log(colors.yellow('Headers:'))
    for (const [key, value] of Object.entries(response.headers)) {
      console.log(colors.yellow(`  ${key}: ${value}`))
    }
  }

  console.log('')
  console.log(colors.blue('┌─────────────────────────────────────────┐'))
  console.log(colors.blue('│ RESPONSE BODY                           │'))
  console.log(colors.blue('└─────────────────────────────────────────┘'))

  if (outputFormat === 'json' && typeof response.data === 'object') {
    console.log(JSON.stringify(response.data, null, 2))
  } else {
    console.log(response.data)
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp()
    process.exit(0)
  }

  if (args.includes('--version') || args.includes('-v')) {
    console.log('Agas CLI v1.0.0')
    process.exit(0)
  }

  if (args[0] === 'intro') {
    displayIntro()
    process.exit(0)
  }

  let method: RequestMethod
  switch (args[0]) {
    case '@get':
      method = RequestMethod.GET
      break
    case '@post':
      method = RequestMethod.POST
      break
    case '@put':
      method = RequestMethod.PUT
      break
    case '@delete':
      method = RequestMethod.DELETE
      break
    case '@patch':
      method = RequestMethod.PATCH
      break
    default:
      console.error(colors.red(`Unknown method: ${args[0]}`))
      showHelp()
      process.exit(1)
  }

  const url = args[1]
  if (!url) {
    console.error(colors.red('URL is required'))
    showHelp()
    process.exit(1)
  }

  const options: {
    headers: Record<string, string>
    data?: any
    verbose: boolean
    silent: boolean
    format: string
    params?: Record<string, any>
  } = {
    headers: {},
    verbose: false,
    silent: false,
    format: 'json',
  }

  for (let i = 2; i < args.length; i++) {
    switch (args[i]) {
      case '-H':
      case '--header':
        const headerParts = args[++i]!.split(':')
        if (headerParts.length >= 2) {
          const key = headerParts[0]!.trim()
          const value = headerParts.slice(1).join(':').trim()
          options.headers[key] = value
        }
        break
      case '-d':
      case '--data':
        try {
          options.data = JSON.parse(args[++i]!)
        } catch (e) {
          options.data = args[i]
        }
        break
      case '-t':
      case '--type':
        const contentType = args[++i]
        switch (contentType) {
          case 'json':
            options.headers['Content-Type'] = 'application/json'
            break
          case 'html':
            options.headers['Content-Type'] = 'text/html'
            break
          case 'text':
            options.headers['Content-Type'] = 'text/plain'
            break
          default:
            console.error(colors.red(`Unknown content type: ${contentType}`))
            process.exit(1)
        }
        break
      case '-p':
      case '--params':
        try {
          options.params = JSON.parse(args[++i]!)
        } catch (e) {
          console.error(colors.red(`Invalid params format: ${args[i]}`))
          process.exit(1)
        }
        break
      case '--verbose':
        options.verbose = true
        break
      case '--silent':
        options.silent = true
        break
      case '--format':
        options.format = args[++i]!
        break
    }
  }

  return { method, url, options }
}

/**
 * Display help information
 */
function showHelp(): void {
  console.log(colors.blue(LOGO))
  console.log(colors.yellow('Agas CLI - Modern HTTP Client'))
  console.log(colors.yellow('Usage:'))
  console.log('  agas @<method> <url> [options]')
  console.log('')
  console.log(colors.yellow('Methods:'))
  console.log('  @get     - GET request')
  console.log('  @post    - POST request')
  console.log('  @put     - PUT request')
  console.log('  @delete  - DELETE request')
  console.log('  @patch   - PATCH request')
  console.log('')
  console.log(colors.yellow('Options:'))
  console.log('  -H, --header <key:value>  - Add request header')
  console.log('  -d, --data <data>         - Request body data')
  console.log('  -t, --type <type>         - Content type (json, html, text)')
  console.log('  -p, --params <json>       - URL parameters as JSON')
  console.log('  --verbose                 - Show detailed output')
  console.log('  --silent                  - Show only response body')
  console.log('  --format <format>         - Output format (json, raw)')
  console.log('  --help                    - Show this help')
  console.log('  --version                 - Show version')
  console.log('')
  console.log(colors.yellow('Examples:'))
  console.log('  agas @get https://api.example.com/users')
  console.log(
    '  agas @post https://api.example.com/users -d \'{"name":"John"}\''
  )
  console.log(
    '  agas @get https://api.example.com/users -H "Authorization: Bearer token"'
  )
  console.log('')
}

/**
 * Main function
 */
async function main() {
  if (process.argv.length === 2) {
    await displayIntro()
    process.exit(0)
  }

  const { method, url, options } = parseArgs()

  if (options.silent) {
    const response = await client.request(url, {
      method,
      headers: options.headers,
      body: options.data,
      params: options.params,
    })

    console.log(
      typeof response.data === 'object'
        ? JSON.stringify(response.data)
        : response.data
    )

    process.exit(0)
  }

  const loadingSpinner = spinner('Sending request')
  loadingSpinner.start()

  try {
    const response = await client.request(url, {
      method,
      headers: options.headers,
      body: options.data,
      params: options.params,
    })

    loadingSpinner.succeed('Request successful')

    formatResponse(
      method,
      url,
      options.headers,
      options.data,
      response,
      options.format,
      options.verbose
    )
  } catch (error: any) {
    loadingSpinner.fail('Request failed')
    console.error(colors.red(`Error: ${error.message}`))
    if (error.context) {
      console.error(colors.red(`Request ID: ${error.context.requestId}`))
      console.error(colors.red(`URL: ${error.context.url}`))
      console.error(colors.red(`Method: ${error.context.method}`))
    }
    process.exit(1)
  }
}

// Run the CLI
main().catch((error) => {
  console.error(colors.red(`Unexpected error: ${error.message}`))
  process.exit(1)
})
