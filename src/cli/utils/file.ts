export async function readFile(path: string): Promise<string> {
  try {
    const file = Bun.file(path);
    return await file.text();
  } catch (error) {
    throw new Error(`Failed to read file: ${path}`);
  }
}

export async function writeFile(path: string, content: string): Promise<void> {
  try {
    await Bun.write(path, content);
  } catch (error) {
    throw new Error(`Failed to write file: ${path}`);
  }
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    const file = Bun.file(path);
    return await file.exists();
  } catch {
    return false;
  }
}
