#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure environment variables are set for build
// Supabase vars come from the platform env / .env files — never hardcode a project here.
process.env.VITE_SITE_URL = process.env.VITE_SITE_URL || 'https://cosmetics-asia.com';

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      cwd: __dirname,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`))));
    p.on('error', reject);
  });

// vite build 之后跑预渲染，为每条路由写一份带专属 head 的 index.html
try {
  // Use the locally installed vite binary (no network / npx resolution at build time).
  const viteBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  await run(process.execPath, [viteBin, 'build']);
  await run('node', ['prerender.mjs']);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
