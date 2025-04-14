import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

export function createLogger(type) {
  const logFile = path.join(logsDir, `${type}.log`);
  
  return {
    log: (data) => {
      fs.appendFileSync(logFile, JSON.stringify(data) + '\n');
    }
  };
}