export function parseBody(data: string): any {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}
