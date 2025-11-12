export function parseQuery(queryStrings: string[]): Record<string, any> {
  const query: Record<string, any> = {};
  
  for (const qs of queryStrings) {
    const [key, value] = qs.split('=');
    if (key && value) {
      query[key] = value;
    }
  }
  
  return query;
}

export function parseJson(jsonStrings: string[]): Record<string, any> {
  const json: Record<string, any> = {};
  
  for (const js of jsonStrings) {
    const [key, value] = js.split('=');
    if (key && value) {
      // Try to parse as JSON value
      try {
        json[key] = JSON.parse(value);
      } catch {
        json[key] = value;
      }
    }
  }
  
  return json;
}

export function parseForm(formStrings: string[]): Record<string, string> {
  const form: Record<string, string> = {};
  
  for (const fs of formStrings) {
    const [key, value] = fs.split('=');
    if (key && value) {
      form[key] = value;
    }
  }
  
  return form;
}

