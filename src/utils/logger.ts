import fs from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const API_LOG_FILE = path.join(LOG_DIR, 'api.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export function logToFile(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  fs.appendFileSync(API_LOG_FILE, logMessage);
  
  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(message);
  }
}

export function getLogPath() {
  return API_LOG_FILE;
}
