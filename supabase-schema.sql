-- Supabase schema pro leady a partnery
-- Spusťte v SQL Editoru v Supabase dashboardu

-- Tabulka partnerů (mapování na auth.users)
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  region TEXT NOT NULL,  -- hamburg, berlin, munich, bonn
  plz_prefixes TEXT[] NOT NULL,  -- např. ['20'] pro Hamburg
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabulka leadů
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  plz TEXT NOT NULL,
  region TEXT NOT NULL,  -- hamburg, berlin, munich, bonn
  -- Rychlý formulář
  name TEXT,
  phone TEXT,
  email TEXT,
  -- Hlavní formulář
  company TEXT,
  fullname TEXT,
  tel TEXT,
  mail TEXT,
  city TEXT,
  install_type TEXT,
  volume TEXT,
  note TEXT,
  source TEXT DEFAULT 'main',  -- 'quick' | 'main'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pro rychlé vyhledávání leadů podle partnera
CREATE INDEX IF NOT EXISTS idx_leads_partner ON leads(partner_id);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Partneři vidí jen své leady
CREATE POLICY "Partners see own leads"
  ON leads FOR SELECT
  USING (
    partner_id IN (
      SELECT id FROM partners WHERE user_id = auth.uid()
    )
  );

-- Partneři vidí jen svůj záznam
CREATE POLICY "Partners see own profile"
  ON partners FOR SELECT
  USING (user_id = auth.uid());

-- Anon i authenticated mohou vkládat leady (z landing page)
CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Funkce pro přiřazení regionu podle PLZ
CREATE OR REPLACE FUNCTION get_region_by_plz(plz_input TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
BEGIN
  prefix := LEFT(TRIM(plz_input), 2);
  -- Hamburg: 20xxx
  IF prefix = '20' THEN RETURN 'hamburg'; END IF;
  -- Berlin: 10, 12, 13, 14
  IF prefix IN ('10','12','13','14') THEN RETURN 'berlin'; END IF;
  -- Munich: 80, 81
  IF prefix IN ('80','81') THEN RETURN 'munich'; END IF;
  -- Bonn: 53xxx
  IF prefix = '53' THEN RETURN 'bonn'; END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger: při vložení leadu přiřadit partnera podle regionu
CREATE OR REPLACE FUNCTION assign_partner_to_lead()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.partner_id IS NULL AND NEW.region IS NOT NULL THEN
    SELECT id INTO NEW.partner_id
    FROM partners
    WHERE region = NEW.region
    LIMIT 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_assign_partner ON leads;
CREATE TRIGGER trigger_assign_partner
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION assign_partner_to_lead();

-- Příklad: vložení 4 partnerů (po vytvoření uživatelů v Auth)
-- INSERT INTO partners (user_id, name, region, plz_prefixes) VALUES
--   ('uuid-hamburg-user', 'Partner Hamburg', 'hamburg', ARRAY['20']),
--   ('uuid-berlin-user', 'Partner Berlin', 'berlin', ARRAY['10','12','13','14']),
--   ('uuid-munich-user', 'Partner Munich', 'munich', ARRAY['80','81']),
--   ('uuid-bonn-user', 'Partner Bonn', 'bonn', ARRAY['53']);
