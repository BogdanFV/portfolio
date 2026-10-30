import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outPath = path.join(root, 'Фарсиев Богдан.pdf');
const port = 5179;
const url = `http://127.0.0.1:${port}/`;

const waitForServer = async (retries = 60) => {
  for (let i = 0; i < retries; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Dev server did not start at ${url}`);
};

const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
await access(viteBin);

const server = spawn(
  process.execPath,
  ['--max-http-header-size=131072', viteBin, '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, BROWSER: 'none' },
  },
);

const logPath = path.join(root, 'scripts', 'vite-pdf.log');
const logStream = createWriteStream(logPath);
server.stdout.pipe(logStream);
server.stderr.pipe(logStream);

try {
  await waitForServer();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('resume-lang', 'ru');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', right: '12mm', bottom: '14mm', left: '12mm' },
  });
  await browser.close();
  console.log(`PDF written: ${outPath}`);
} finally {
  server.kill('SIGTERM');
}
