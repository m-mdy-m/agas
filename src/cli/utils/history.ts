import type { RequestHistory } from '../types';
import {MAX_HISTORY_SIZE,HISTORY_FILE} from "./constant"

export async function saveHistory(entry: RequestHistory): Promise<void> {
  try {
    const history = await loadHistory();
    history.unshift(entry);
    
    // Keep only last MAX_HISTORY_SIZE entries
    if (history.length > MAX_HISTORY_SIZE) {
      history.splice(MAX_HISTORY_SIZE);
    }
    
    await Bun.write(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

export async function loadHistory(): Promise<RequestHistory[]> {
   const file = Bun.file(HISTORY_FILE);
   if (await file.exists()) {
     return await file.json();
   }
  return [];
}

export async function showHistory(): Promise<void> {
  const history = await loadHistory();
  
  if (history.length === 0) {
    console.log('No history yet');
    return;
  }
  
  console.log('\nRequest History:\n');
  
  for (const entry of history.slice(0, 20)) {
    const date = new Date(entry.timestamp);
    const statusColor = entry.status >= 200 && entry.status < 300 ? '\x1b[32m' : '\x1b[31m';
    
    console.log(
      `${date.toLocaleString()} - ` +
      `${entry.method.padEnd(7)} ${entry.url.padEnd(50)} ` +
      `${statusColor}${entry.status}\x1b[0m ` +
      `(${entry.duration}ms)`
    );
  }
  
  if (history.length > 20) {
    console.log(`\n... and ${history.length - 20} more`);
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await Bun.write(HISTORY_FILE, '[]');
    console.log('History cleared');
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}
