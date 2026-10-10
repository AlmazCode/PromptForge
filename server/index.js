'use strict';

import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';

const { server, db } = createApp({
  root: fileURLToPath(new URL('..', import.meta.url)),
  database: process.env.DATABASE_PATH || '.data/promptforge.sqlite',
  apiKey: process.env.OPENAI_API_KEY || '',
  model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  demoBilling: process.env.ENABLE_DEMO_BILLING === 'true',
  secureCookie: process.env.COOKIE_SECURE === 'true'
});
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '127.0.0.1';
server.listen(port, host, () => {
  console.log(`PromptForge: http://${host}:${port}`);
  console.log(`AI checks: ${process.env.OPENAI_API_KEY ? 'configured' : 'set OPENAI_API_KEY in .env to enable'}`);
});
function stop() { server.close(() => { db.close(); process.exit(0); }); }
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
