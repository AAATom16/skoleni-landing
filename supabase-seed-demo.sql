-- Demo leady pro testování partner dashboardu
-- Spusťte PO vytvoření partnerů (supabase-schema.sql + INSERT partnerů)
-- Trigger přiřadí partner_id podle regionu

INSERT INTO leads (plz, region, name, phone, email, source, created_at) VALUES
  ('20095', 'hamburg', 'Hans Müller', '+49 40 12345678', 'hans.mueller@example.de', 'quick', now() - interval '2 days'),
  ('20359', 'hamburg', 'Anna Schmidt', '+49 40 87654321', 'anna.schmidt@solarteam.de', 'quick', now() - interval '1 day');

INSERT INTO leads (plz, region, company, fullname, tel, mail, city, install_type, volume, note, source, created_at) VALUES
  ('20144', 'hamburg', 'Hamburg Solar GmbH', 'Peter Weber', '+49 40 1112233', 'p.weber@hamburgsolar.de', 'Hamburg', 'rd', '4-10', 'Rodinný dům, střecha 45 m²', 'main', now() - interval '5 hours'),
  ('10115', 'berlin', 'Berlin Energie', 'Lisa Hoffmann', '+49 30 4445566', 'lisa@berlinenergie.de', 'Berlin-Mitte', 'komerci', '11-30', 'Komerční objekt, 50 kWp', 'main', now() - interval '3 days'),
  ('12489', 'berlin', 'Solar Berlin', 'Michael Krause', '+49 30 7778899', 'm.krause@solarberlin.de', 'Berlin-Adlershof', 'mix', '4-10', 'Mix RD + komerce', 'main', now() - interval '1 day'),
  ('80331', 'munich', 'Münchner Solar', 'Thomas Bauer', '+49 89 1234500', 'bauer@muenchnersolar.de', 'München', 'rd', '1-3', 'Rodinný dům 8 kWp', 'main', now() - interval '2 days'),
  ('81667', 'munich', 'Bavaria FVE', 'Sabine Fischer', '+49 89 6543210', 's.fischer@bavariafve.de', 'München', 'komerci', '30+', 'Velký komerční projekt', 'main', now() - interval '12 hours'),
  ('53111', 'bonn', 'Rhein Solar', 'Klaus Richter', '+49 228 1112233', 'k.richter@rheinsolar.de', 'Bonn', 'rd', '4-10', 'RD s baterií', 'main', now() - interval '4 days'),
  ('53225', 'bonn', 'Bonn Energie', 'Maria Schulz', '+49 228 4445566', 'schulz@bonnenergie.de', 'Bonn-Beuel', 'mix', '11-30', 'Více rodinných domů', 'main', now() - interval '6 hours');
