-- 1) Oprava RLS pro INSERT (spusťte v Supabase SQL Editoru)
-- 2) Nebo použijte funkci seed_demo_leads níže – pak zavoláte npm run seed:demo

-- Varianta A: Oprava policy
GRANT INSERT ON leads TO anon;
DROP POLICY IF EXISTS "Anyone can insert leads" ON leads;
CREATE POLICY "Anyone can insert leads" ON leads FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Varianta B: Funkce pro seed (obchází RLS) – spusťte pokud varianta A nepomůže
CREATE OR REPLACE FUNCTION seed_demo_leads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO leads (plz, region, name, phone, email, source) VALUES
    ('20095', 'hamburg', 'Hans Müller', '+49 40 12345678', 'hans.mueller@example.de', 'quick'),
    ('20359', 'hamburg', 'Anna Schmidt', '+49 40 87654321', 'anna.schmidt@solarteam.de', 'quick');
  INSERT INTO leads (plz, region, company, fullname, tel, mail, city, install_type, volume, note, source) VALUES
    ('20144', 'hamburg', 'Hamburg Solar GmbH', 'Peter Weber', '+49 40 1112233', 'p.weber@hamburgsolar.de', 'Hamburg', 'rd', '4-10', 'Rodinný dům, střecha 45 m²', 'main'),
    ('10115', 'berlin', 'Berlin Energie', 'Lisa Hoffmann', '+49 30 4445566', 'lisa@berlinenergie.de', 'Berlin-Mitte', 'komerci', '11-30', 'Komerční objekt, 50 kWp', 'main'),
    ('12489', 'berlin', 'Solar Berlin', 'Michael Krause', '+49 30 7778899', 'm.krause@solarberlin.de', 'Berlin-Adlershof', 'mix', '4-10', 'Mix RD + komerce', 'main'),
    ('80331', 'munich', 'Münchner Solar', 'Thomas Bauer', '+49 89 1234500', 'bauer@muenchnersolar.de', 'München', 'rd', '1-3', 'Rodinný dům 8 kWp', 'main'),
    ('81667', 'munich', 'Bavaria FVE', 'Sabine Fischer', '+49 89 6543210', 's.fischer@bavariafve.de', 'München', 'komerci', '30+', 'Velký komerční projekt', 'main'),
    ('53111', 'bonn', 'Rhein Solar', 'Klaus Richter', '+49 228 1112233', 'k.richter@rheinsolar.de', 'Bonn', 'rd', '4-10', 'RD s baterií', 'main'),
    ('53225', 'bonn', 'Bonn Energie', 'Maria Schulz', '+49 228 4445566', 'schulz@bonnenergie.de', 'Bonn-Beuel', 'mix', '11-30', 'Více rodinných domů', 'main');
END;
$$;

GRANT EXECUTE ON FUNCTION seed_demo_leads() TO anon;
