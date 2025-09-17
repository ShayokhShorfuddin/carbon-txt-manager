import fs from 'node:fs';
import path from 'node:path';

export default function hasCarbon(): boolean {
  const filePath = path.join(process.cwd(), 'carbon.txt');
  return fs.existsSync(filePath);
}