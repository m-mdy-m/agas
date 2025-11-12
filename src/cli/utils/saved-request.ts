import type { SavedRequest } from '../types';
import {AGAS_DIR,REQUESTS_FILE} from "./constant"

export async function saveRequest(request: SavedRequest): Promise<void> {
  try {
    const requests = await loadRequests();
    
    // Remove existing request with same name
    const filtered = requests.filter(r => r.name !== request.name);
    filtered.push(request);
    
    await Bun.write(REQUESTS_FILE, JSON.stringify(filtered, null, 2));
    console.log(`✓ Saved request: ${request.name}`);
  } catch (error) {
    console.error('Failed to save request:', error);
  }
}

export async function loadRequest(name: string): Promise<SavedRequest | null> {
  try {
    const requests = await loadRequests();
    return requests.find(r => r.name === name) || null;
  } catch (error) {
    return null;
  }
}

export async function loadRequests(): Promise<SavedRequest[]> {
  const file = Bun.file(REQUESTS_FILE);
  if (await file.exists()) {
    return await file.json();
  }
  return [];
}

export async function deleteRequest(name: string): Promise<void> {
  try {
    const requests = await loadRequests();
    const filtered = requests.filter(r => r.name !== name);
    
    await Bun.write(REQUESTS_FILE, JSON.stringify(filtered, null, 2));
    console.log(`✓ Deleted request: ${name}`);
  } catch (error) {
    console.error('Failed to delete request:', error);
  }
}

export async function listRequests(): Promise<void> {
  const requests = await loadRequests();
  
  if (requests.length === 0) {
    console.log('No saved requests');
    return;
  }
  
  console.log('\nSaved Requests:\n');
  
  for (const request of requests) {
    console.log(
      `${request.name.padEnd(20)} - ` +
      `${request.method.padEnd(7)} ${request.url}`
    );
  }
}
