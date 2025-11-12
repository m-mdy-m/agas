import {colors} from "./colors"
export function formatJSON(data: any, c: typeof colors, indent = 0): string {
  const spaces = '  '.repeat(indent);
  
  if (data === null) {
    return `${c.gray}null${c.reset}`;
  }
  
  if (typeof data === 'string') {
    return `${c.green}"${data}"${c.reset}`;
  }
  
  if (typeof data === 'number') {
    return `${c.yellow}${data}${c.reset}`;
  }
  
  if (typeof data === 'boolean') {
    return `${c.magenta}${data}${c.reset}`;
  }
  
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return '[]';
    }
    
    const items = data.map(item => 
      `${spaces}  ${formatJSON(item, c, indent + 1)}`
    ).join(',\n');
    
    return `[\n${items}\n${spaces}]`;
  }
  
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    
    if (keys.length === 0) {
      return '{}';
    }
    
    const items = keys.map(key => {
      const value = formatJSON(data[key], c, indent + 1);
      return `${spaces}  ${c.cyan}"${key}"${c.reset}: ${value}`;
    }).join(',\n');
    
    return `{\n${items}\n${spaces}}`;
  }
  
  return `${data}`;
}
