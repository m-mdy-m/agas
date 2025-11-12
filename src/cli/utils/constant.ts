import {homedir} from "node:os"
import {join} from "node:path"
export const AGAS_DIR = join(homedir(), '.agas');
export const HISTORY_FILE = join(AGAS_DIR, 'history.json');
export const MAX_HISTORY_SIZE = 100;
export const CONFIG_FILE = join(AGAS_DIR, 'config.json')
export const REQUESTS_FILE = join(AGAS_DIR, 'requests.json');
