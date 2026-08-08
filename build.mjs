#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure environment variables are set for build
process.env.VITE_SUPABASE_PROJECT_ID = process.env.VITE_SUPABASE_PROJECT_ID || 'ioyqybepluaoqmrfyzxw';
process.env.VITE_SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveXF5YmVwbHVhb3FtcmZ5enh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzAzMjksImV4cCI6MjA5MzkwNjMyOX0.eXc8oecVT8ZatyB4ii-_fA6nHMhIA1Jq4_pH956y1LA';
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ioyqybepluaoqmrfyzxw.supabase.co';
process.env.VITE_SITE_URL = process.env.VITE_SITE_URL || 'https://cosmetics-asia.com';

const vite = spawn('npx', ['vite', 'build'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

vite.on('exit', (code) => {
  process.exit(code);
});
