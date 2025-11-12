import type { ResponseConfig } from "../../types"
import type {FormatOptions} from "../types"
import {colors,getStatusColor,noColors} from "./colors"
import {formatJSON} from "./json"
import {formatTable} from "./table"
import {formatHeaders} from './headers'
export async function formatResponse(response: ResponseConfig, options: FormatOptions = {}) {
  const {
    colors: useColors = true,
    verbose = false,
    pretty = true,
    table = false,
  } = options;
  const c = useColors ? colors : noColors();

  console.log('');
  const statusColor = getStatusColor(response.status, c);
  const statusIcon = response.status >= 200 && response.status < 300 ? '✓' : '✗';
  console.log(`${statusColor}${statusIcon} Status: ${response.status} ${response.statusText}${c.reset}`);
  console.log(`${c.dim}⏱  Duration: ${response.duration.toFixed(2)}ms${c.reset}`);
  if (verbose) {
    console.log(`\n${c.bright}${c.cyan}Headers:${c.reset}`);
    formatHeaders(response.headers, c);
  }
  console.log(`\n${c.bright}${c.cyan}Response:${c.reset}`);
  
  if (table && Array.isArray(response.data)) {
    formatTable(response.data, c);
  } else if (typeof response.data === 'object' && response.data !== null) {
    if (pretty) {
      console.log(formatJSON(response.data, c));
    } else {
      console.log(JSON.stringify(response.data));
    }
  } else {
    console.log(response.data);
  }

  console.log('');
}
