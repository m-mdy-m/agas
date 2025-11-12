export function parseHeaders(headerStrings: string[]): Record<string, string> {
  const headers: Record<string, string> = {};
  
  for (const header of headerStrings) {
    const [key, ...valueParts] = header.split(':');
    if (key && valueParts.length > 0) {
      headers[key.trim()] = valueParts.join(':').trim();
    }
  }
  
  return headers;
}
