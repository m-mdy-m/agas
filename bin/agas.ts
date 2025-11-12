#!/usr/bin/env bun
import { Agas } from '../src';
import { formatResponse } from '../src/cli/formatters';
import { loadConfig, saveConfig } from '../src/cli/utils/config';
import { saveHistory, showHistory, clearHistory } from '../src/cli/utils/history';
import { 
  saveRequest, 
  loadRequest, 
  listRequests, 
  deleteRequest 
} from '../src/cli/utils/saved-request';
import { parseBody } from '../src/cli/parsers';
import { spinner ,showIntro} from '../src/cli/ui';
import type { CLIOptions, SavedRequest } from '../src/cli/types';
import type { Method } from '../src/types';
import { colors } from "../src/cli/formatters/colors";
import pkg from "../package.json";

const LOGO = `
${colors.cyan}     █████╗  ██████╗  █████╗ ███████╗
    ██╔══██╗██╔════╝ ██╔══██╗██╔════╝
    ███████║██║  ███╗███████║███████╗
    ██╔══██║██║   ██║██╔══██║╚════██║
    ██║  ██║╚██████╔╝██║  ██║███████║
    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝${colors.reset}
    
    Modern HTTP Client for the Terminal
    Version ${pkg.version}
`;

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await showIntro();
    process.exit(0);
  }

  const command = args[0]!.toLowerCase();

  // Version flag
  if (command === '--version' || command === '-v') {
    console.log(`agas version ${pkg.version}`);
    process.exit(0);
  }

  // Help flag
  if (command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  // Config management
  if (command === 'config') {
    await handleConfig(args.slice(1));
    process.exit(0);
  }

  // History management
  if (command === 'history') {
    if (args[1] === 'clear') {
      await clearHistory();
    } else {
      await showHistory();
    }
    process.exit(0);
  }

  // Saved requests management
  if (command === 'requests') {
    await handleRequests(args.slice(1));
    process.exit(0);
  }

  if (command === 'run') {
    await handleRun(args[1]);
    process.exit(0);
  }

  // Check for URL as first argument (shorthand GET)
  if (command.startsWith('http://') || command.startsWith('https://')) {
    await executeRequest('GET', command, parseCliOptions(args.slice(1)));
    process.exit(0);
  }

  // HTTP methods
  const validMethods: Method[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  const method = command.toUpperCase() as Method;

  if (!validMethods.includes(method)) {
    console.error(`${colors.red}Invalid command: ${command}${colors.reset}`);
    console.log(`\nRun ${colors.cyan}agas help${colors.reset} for usage information`);
    process.exit(1);
  }

  const url = args[1];
  if (!url) {
    console.error(`${colors.red}URL is required${colors.reset}`);
    console.log(`\nUsage: agas ${method.toLowerCase()} <url> [options]`);
    process.exit(1);
  }

  const options = parseCliOptions(args.slice(2));
  await executeRequest(method, url, options);
}

function parseCliOptions(args: string[]): CLIOptions {
  const options: CLIOptions = {
    headers: {},
    query: {},
    json: {},
    form: {},
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;

    switch (arg) {
      case '-H':
      case '--header':
        const header = args[++i];
        if (header) {
          const [key, ...valueParts] = header.split(':');
          if (key && valueParts.length > 0) {
            options.headers![key.trim()] = valueParts.join(':').trim();
          }
        }
        break;

      case '-q':
      case '--query':
        const queryStr = args[++i];
        if (queryStr) {
          const [key, value] = queryStr.split('=');
          if (key && value) {
            options.query![key] = value;
          }
        }
        break;

      case '-d':
      case '--data':
        options.data = args[++i];
        break;

      case '--json':
        const jsonStr = args[++i];
        if (jsonStr) {
          const [key, value] = jsonStr.split('=');
          if (key && value) {
            options.json![key] = value;
          }
        }
        break;

      case '--form':
        const formStr = args[++i];
        if (formStr) {
          const [key, value] = formStr.split('=');
          if (key && value) {
            options.form![key] = value;
          }
        }
        break;

      case '-o':
      case '--output':
        options.output = args[++i];
        break;

      case '--pretty':
        options.pretty = true;
        break;

      case '-v':
      case '--verbose':
        options.verbose = true;
        break;

      case '--silent':
        options.silent = true;
        break;

      case '--follow':
        options.follow = true;
        break;

      case '--timeout':
        const timeout = parseInt(args[++i]!);
        if (!isNaN(timeout)) {
          options.timeout = timeout;
        }
        break;

      case '--save':
        options.save = args[++i];
        break;

      case '--table':
        options.table = true;
        break;
    }
  }

  return options;
}

async function executeRequest(method: Method, url: string, options: CLIOptions) {
  const config = await loadConfig();
  const client = new Agas({
    baseURL: config.baseURL,
    timeout: options.timeout || config.timeout || 30000,
    headers: { ...config.defaultHeaders, ...options.headers },
  });

  let data: any = undefined;
  if (options.data) {
    data = parseBody(options.data);
  } else if (Object.keys(options.json!).length > 0) {
    data = options.json;
  } else if (Object.keys(options.form!).length > 0) {
    data = new URLSearchParams(options.form as Record<string, string>);
  }

  const spin = spinner(`${method} ${url}`);
  if (!options.silent) {
    spin.start();
  }

  const startTime = Date.now();

  try {
    const response = await client.request({
      method,
      url,
      params: options.query,
      data,
      headers: options.headers,
    });

    const duration = Date.now() - startTime;

    if (!options.silent) {
      spin.succeed(`${method} ${url} (${duration}ms)`);
    }

    if (options.silent) {
      if (typeof response.data === 'string') {
        console.log(response.data);
      } else {
        console.log(JSON.stringify(response.data));
      }
    } else {
      await formatResponse(response, {
        colors: !process.env.NO_COLOR,
        verbose: options.verbose,
        pretty: options.pretty,
        table: options.table,
      });
    }

    if (config.saveHistory !== false) {
      await saveHistory({
        id: response.id,
        method,
        url,
        status: response.status,
        duration,
        timestamp: new Date().toISOString(),
      });
    }

    if (options.save) {
      const savedRequest: SavedRequest = {
        name: options.save,
        method,
        url,
        headers: options.headers,
        data,
        params: options.query,
        createdAt: new Date().toISOString(),
      };
      await saveRequest(savedRequest);
    }

    if (options.output) {
      const content = typeof response.data === 'string' 
        ? response.data 
        : JSON.stringify(response.data, null, 2);
      await Bun.write(options.output, content);
      console.log(`\n${colors.green}Saved to ${options.output}${colors.reset}`);
    }

    process.exit(0);
  } catch (error: any) {
    const duration = Date.now() - startTime;

    if (!options.silent) {
      spin.fail(`${method} ${url} (${duration}ms)`);
    }

    console.error(`\n${colors.red}Error: ${error.message}${colors.reset}`);

    if (error.response) {
      console.error(`\nStatus: ${error.response.status} ${error.response.statusText}`);
      if (error.response.data) {
        console.error(`\nResponse:`);
        console.error(JSON.stringify(error.response.data, null, 2));
      }
    }

    if (options.verbose && error.config) {
      console.error(`\nRequest details:`);
      console.error(`  URL: ${error.config.url}`);
      console.error(`  Method: ${error.config.method}`);
      if (error.config.headers) {
        console.error(`  Headers:`, error.config.headers);
      }
    }

    process.exit(1);
  }
}

async function handleConfig(args: string[]) {
  const action = args[0];
  
  if (action === 'set') {
    const key = args[1];
    const value = args[2];
    
    if (!key || !value) {
      console.error(`${colors.red}Usage: agas config set <key> <value>${colors.reset}`);
      process.exit(1);
    }

    const config = await loadConfig();
    (config as any)[key] = value;
    await saveConfig(config);
    
    console.log(`${colors.green}Config updated: ${key} = ${value}${colors.reset}`);
  } else if (action === 'get') {
    const key = args[1];
    const config = await loadConfig();
    
    if (key) {
      console.log((config as any)[key] || '');
    } else {
      console.log(JSON.stringify(config, null, 2));
    }
  } else if (action === 'list') {
    const config = await loadConfig();
    console.log('\nCurrent configuration:');
    console.log(JSON.stringify(config, null, 2));
  } else {
    console.log('\nConfig commands:');
    console.log('  agas config set <key> <value>  - Set config value');
    console.log('  agas config get [key]          - Get config value');
    console.log('  agas config list               - List all config');
  }
}

async function handleRequests(args: string[]) {
  const action = args[0];
  
  if (action === 'list' || !action) {
    await listRequests();
  } else if (action === 'delete') {
    const name = args[1];
    if (!name) {
      console.error(`${colors.red}Request name is required${colors.reset}`);
      process.exit(1);
    }
    await deleteRequest(name);
  } else {
    console.log('\nRequests commands:');
    console.log('  agas requests list    - List all saved requests');
    console.log('  agas requests delete  - Delete a saved request');
  }
}

async function handleRun(name: string | undefined) {
  if (!name) {
    console.error(`${colors.red}Request name is required${colors.reset}`);
    process.exit(1);
  }

  const savedRequest = await loadRequest(name);
  if (!savedRequest) {
    console.error(`${colors.red}Request not found: ${name}${colors.reset}`);
    process.exit(1);
  }

  console.log(`${colors.cyan}Running saved request: ${name}${colors.reset}\n`);

  const options: CLIOptions = {
    headers: savedRequest.headers,
    query: savedRequest.params,
    data: savedRequest.data ? JSON.stringify(savedRequest.data) : undefined,
  };

  await executeRequest(savedRequest.method, savedRequest.url, options);
}

function showHelp() {
  console.log(LOGO);
  console.log(`${colors.bright}USAGE${colors.reset}`);
  console.log('  agas <method> <url> [options]');
  console.log('  agas <url> [options]           (defaults to GET)\n');

  console.log(`${colors.bright}METHODS${colors.reset}`);
  console.log('  get, post, put, delete, patch, head, options\n');

  console.log(`${colors.bright}OPTIONS${colors.reset}`);
  console.log('  -H, --header <key:value>    Add request header');
  console.log('  -q, --query <key=value>     Add query parameter');
  console.log('  -d, --data <data>           Request body data');
  console.log('  --json <key=value>          Add JSON field');
  console.log('  --form <key=value>          Add form field');
  console.log('  -o, --output <file>         Save response to file');
  console.log('  --pretty                    Pretty print response');
  console.log('  -v, --verbose               Verbose output');
  console.log('  --silent                    Only output response body');
  console.log('  --follow                    Follow redirects');
  console.log('  --timeout <ms>              Request timeout');
  console.log('  --save <name>               Save request for later');
  console.log('  --table                     Display as table\n');

  console.log(`${colors.bright}COMMANDS${colors.reset}`);
  console.log('  config set <key> <value>    Set config value');
  console.log('  config get [key]            Get config value');
  console.log('  config list                 List all config');
  console.log('  history                     Show request history');
  console.log('  history clear               Clear request history');
  console.log('  requests list               List saved requests');
  console.log('  requests delete <name>      Delete saved request');
  console.log('  run <name>                  Run saved request');
  console.log('  --version, -v               Show version');
  console.log('  help, --help, -h            Show this help\n');

  console.log(`${colors.bright}EXAMPLES${colors.reset}`);
  console.log('  agas https://api.example.com');
  console.log('  agas get https://api.example.com');
  console.log('  agas post https://api.example.com --json name=John');
  console.log('  agas get https://api.example.com -q page=1 -q limit=10');
  console.log('  agas post https://api.example.com -d \'{"name":"John"}\'');
  console.log('  agas get https://api.example.com -H "Authorization: Bearer token"');
  console.log('  agas get https://api.example.com --pretty --table');
  console.log('  agas post https://api.example.com --json name=John --save create-user');
  console.log('  agas run create-user\n');

  console.log(`${colors.bright}MORE INFO${colors.reset}`);
  console.log('  Documentation: https://github.com/m-mdy-m/agas');
  console.log('  Issues: https://github.com/m-mdy-m/agas/issues\n');
}

main().catch((error) => {
  console.error(`${colors.red}Unexpected error: ${error.message}${colors.reset}`);
  process.exit(1);
});