/**
 * Vloží demo leady do Supabase.
 * Použití: npm run seed:demo
 * Credentials: .env (SUPABASE_URL, SUPABASE_ANON_KEY) nebo supabase-config.js
 */
const path = require('path');
const fs = require('fs');

let url = process.env.SUPABASE_URL;
let key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  try {
    require('dotenv').config();
    url = process.env.SUPABASE_URL;
    key = process.env.SUPABASE_ANON_KEY;
  } catch (_) {}
}

if (!url || !key) {
  const configPath = path.join(__dirname, '../supabase-config.js');
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf8');
    const urlMatch = content.match(/url:\s*['"]([^'"]+)['"]/);
    const keyMatch = content.match(/anonKey:\s*['"]([^'"]+)['"]/);
    if (urlMatch) url = urlMatch[1];
    if (keyMatch) key = keyMatch[1];
  }
}

if (!url || !key || url === 'YOUR_SUPABASE_URL') {
  console.error('');
  console.error('Chybí Supabase credentials.');
  console.error('');
  console.error('1. Zkopírujte .env.example do .env:');
  console.error('   cp .env.example .env');
  console.error('');
  console.error('2. Doplňte SUPABASE_URL a SUPABASE_SERVICE_ROLE_KEY (nebo ANON_KEY) z:');
  console.error('   https://supabase.com/dashboard/project/_/settings/api');
  console.error('');
  console.error('Nebo doplňte údaje přímo do supabase-config.js');
  console.error('');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(url, key);

async function seed() {
  // Použijeme RPC funkci seed_demo_leads – obchází RLS (vyžaduje spuštění supabase-fix-rls.sql)
  const { error } = await supabase.rpc('seed_demo_leads');
  if (error) {
    console.error('Chyba:', error.message);
    console.error('');
    console.error('Spusťte v Supabase SQL Editoru soubor supabase-fix-rls.sql');
    process.exit(1);
  }
  console.log('Vloženo 9 demo leadů.');
}

seed();
