/**
 * Vytvoří supabase-config.js z env proměnných (pro Railway).
 * Lokálně zkopírujte supabase-config.example.js do supabase-config.js.
 */
const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || process.env.RAILWAY_SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY || process.env.RAILWAY_SUPABASE_ANON_KEY;

const outPath = path.join(__dirname, '../supabase-config.js');

if (url && key) {
  const content = `window.SUPABASE_CONFIG = {
  url: '${url}',
  anonKey: '${key}'
};
`;
  fs.writeFileSync(outPath, content);
  console.log('supabase-config.js vytvořen z env');
} else if (!fs.existsSync(outPath)) {
  fs.copyFileSync(path.join(__dirname, '../supabase-config.example.js'), outPath);
  console.log('supabase-config.example.js zkopírován (doplňte údaje)');
}
