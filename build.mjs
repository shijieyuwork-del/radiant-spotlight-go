#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure environment variables are set for build
process.env.VITE_SUPABASE_PROJECT_ID = process.env.VITE_SUPABASE_PROJECT_ID || 'vczghaemqtmsxvgtvbah';
process.env.VITE_SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_dsvO2g-z3uilb2vU7nRXOQ_wdgoQyX1';
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vczghaemqtmsxvgtvbah.supabase.co';
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
  await run('npx', ['vite', 'build']);
  await run('node', ['prerender.mjs']);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
