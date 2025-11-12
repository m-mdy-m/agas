import {colors}  from "./colors"
export function formatTable(data: any[], c: typeof colors) {
  if (data.length === 0) {
    console.log('  (empty)');
    return;
  }
  const keys = Array.from(
    new Set(data.flatMap(item => Object.keys(item)))
  );
  const widths: Record<string, number> = {};
  for (const key of keys) {
    widths[key] = Math.max(
      key.length,
      ...data.map(item => String(item[key] || '').length)
    );
  }
  const header = keys.map(key => 
    c.bright + key.padEnd(widths[key]!) + c.reset
  ).join(' │ ');
  
  const separator = keys.map(key => 
    '─'.repeat(widths[key]!)
  ).join('─┼─');

  console.log(`  ${header}`);
  console.log(`  ${separator}`);

  // Rows
  for (const item of data) {
    const row = keys.map(key => {
      const value = String(item[key] || '');
      return value.padEnd(widths[key]!);
    }).join(' │ ');
    
    console.log(`  ${row}`);
  }

  // Footer
  console.log(`\n  ${c.dim}Total: ${data.length} items${c.reset}`);
}
