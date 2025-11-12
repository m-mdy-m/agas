import {colors}  from "./colors"
export function formatHeaders(headers: Record<string, string>, c: typeof colors) {
  const maxKeyLength = Math.max(...Object.keys(headers).map(k => k.length));
  
  for (const [key, value] of Object.entries(headers)) {
    const paddedKey = key.padEnd(maxKeyLength);
    console.log(`  ${c.gray}${paddedKey}${c.reset}: ${c.white}${value}${c.reset}`);
  }
}
