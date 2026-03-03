/**
 * Vytvoří demo partnera v Supabase (Hamburg region).
 * Použití: SUPABASE_SERVICE_ROLE_KEY=... node scripts/create-demo-partner.js
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Potřebuji SUPABASE_URL a SUPABASE_SERVICE_ROLE_KEY v .env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const DEMO_EMAIL = 'partner@fvepakety.demo';
const DEMO_PASSWORD = 'DemoPartner2026!';

async function main() {
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
  });

  if (userError) {
    if (userError.message.includes('already been registered')) {
      console.log('Uživatel již existuje. Získejte user_id z Supabase Auth a spusťte:');
      console.log(`INSERT INTO partners (user_id, name, region, plz_prefixes) 
  SELECT id, 'Demo Partner Hamburg', 'hamburg', ARRAY['20'] 
  FROM auth.users WHERE email = '${DEMO_EMAIL}' 
  ON CONFLICT (user_id) DO NOTHING;`);
      return;
    }
    console.error('Chyba:', userError.message);
    process.exit(1);
  }

  const { error: partnerError } = await supabase.from('partners').insert({
    user_id: user.user.id,
    name: 'Demo Partner Hamburg',
    region: 'hamburg',
    plz_prefixes: ['20'],
  });

  if (partnerError) {
    console.error('Chyba při vytváření partnera:', partnerError.message);
    process.exit(1);
  }

  console.log('');
  console.log('Demo partner vytvořen!');
  console.log('');
  console.log('Přihlašovací údaje:');
  console.log('  E-mail:', DEMO_EMAIL);
  console.log('  Heslo:', DEMO_PASSWORD);
  console.log('');
  console.log('Region: Hamburg (PLZ 20xxx)');
  console.log('');
}

main();
