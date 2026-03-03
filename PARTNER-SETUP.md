# Nastavení partner portálu

## 1. Supabase

1. Vytvořte projekt na [supabase.com](https://supabase.com)
2. V **SQL Editor** spusťte obsah souboru `supabase-schema.sql`
3. V **Settings → API** zkopírujte URL a anon key
4. V souboru `supabase-config.js` doplňte:

```js
window.SUPABASE_CONFIG = {
  url: 'https://vaše-projekt.supabase.co',
  anonKey: 'váš-anon-key'
};
```

## 2. Partneři (uživatelé)

1. V Supabase **Authentication → Users** vytvořte 4 uživatele (e-mail + heslo)
2. V **SQL Editor** vložte partnery (nahraďte `user_id` z Auth):

```sql
INSERT INTO partners (user_id, name, region, plz_prefixes) VALUES
  ('uuid-uživatele-1', 'Partner Hamburg', 'hamburg', ARRAY['20']),
  ('uuid-uživatele-2', 'Partner Berlin', 'berlin', ARRAY['10','12','13','14']),
  ('uuid-uživatele-3', 'Partner Munich', 'munich', ARRAY['80','81']),
  ('uuid-uživatele-4', 'Partner Bonn', 'bonn', ARRAY['53']);
```

`user_id` získáte v **Authentication → Users** u každého uživatele.

## 3. Demo leady (volitelné)

Pro rychlé otestování dashboardu spusťte v SQL Editoru soubor `supabase-seed-demo.sql`. Přidá demo leady pro všechny 4 regiony (Hamburg, Berlin, Munich, Bonn). Spusťte až po vytvoření partnerů.

## 4. Rozdělení podle PLZ

| Region | PLZ (prefix) | Okolí |
|--------|--------------|-------|
| Hamburg | 20xxx | Hamburg |
| Berlin | 10, 12, 13, 14xxx | Berlín |
| Munich | 80, 81xxx | Mnichov |
| Bonn | 53xxx | Bonn |

## 5. Přístup

- **Přihlášení**: `/partner/login.html`
- **Dashboard**: `/partner/dashboard.html` (po přihlášení)

Partneři vidí jen leady přiřazené jejich regionu (PLZ).
