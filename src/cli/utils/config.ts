import type { CLIConfig } from '../types';
import {CONFIG_FILE,AGAS_DIR} from "./constant"

export async function loadConfig(): Promise<CLIConfig> {
   const file = Bun.file(CONFIG_FILE);
   if (await file.exists()) {
     return await file.json();
   }
  return getDefaultConfig();
}

export async function saveConfig(config: CLIConfig): Promise<void> {
  try {
    await Bun.write(AGAS_DIR, '');
  
    await Bun.write(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Failed to save config:', error);
  }
}

function getDefaultConfig(): CLIConfig {
  return {
    baseURL: '',
    authToken: '',
    timeout: 30000,
    defaultHeaders: {},
    prettyPrint: true,
    colorOutput: true,
    saveHistory: true,
  };
}
