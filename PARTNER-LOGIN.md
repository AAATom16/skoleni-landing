# Přihlášení partnera

## URL
- **Landing:** https://insightful-optimism-production-e2ad.up.railway.app/
- **Partner přihlášení:** https://insightful-optimism-production-e2ad.up.railway.app/partner/login.html

## Vytvoření demo partnera

### Možnost 1: Skript (rychlejší)

1. V Supabase → **Settings → API** zkopírujte **service_role** klíč (secret)
2. Přidejte do `.env`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=zkopírovaný-klíč
   ```
3. Spusťte:
   ```bash
   node scripts/create-demo-partner.js
   ```

### Možnost 2: Ručně v Supabase

1. **Authentication → Users → Add user**
   - Email: `partner@fvepakety.demo`
   - Password: `DemoPartner2026!`
   - Potvrďte e-mail (Email confirm: ON)

2. Zkopírujte **User UID** nového uživatele

3. V **SQL Editor** spusťte (nahraďte `UUID`):
   ```sql
   INSERT INTO partners (user_id, name, region, plz_prefixes) 
   VALUES ('UUID', 'Demo Partner Hamburg', 'hamburg', ARRAY['20']);
   ```

## Přihlašovací údaje (po vytvoření)

- **E-mail:** partner@fvepakety.demo
- **Heslo:** DemoPartner2026!
- **Region:** Hamburg (vidí leady s PLZ 20xxx)
