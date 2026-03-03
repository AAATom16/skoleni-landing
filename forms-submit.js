/**
 * Odesílání formulářů do Supabase s přiřazením partnera podle PLZ
 * Regiony: Hamburg (20xxx), Berlin (10/12/13/14xxx), Munich (80/81xxx), Bonn (53xxx)
 */
(function() {
  var supabaseClient = null;
  if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL' && typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
  }

  function getRegionFromPlz(plz) {
    const p = String(plz).replace(/\s/g, '').slice(0, 2);
    if (p === '20') return 'hamburg';
    if (['10','12','13','14'].includes(p)) return 'berlin';
    if (['80','81'].includes(p)) return 'munich';
    if (p === '53') return 'bonn';
    return null;
  }

  async function submitLead(data) {
    const sb = supabaseClient;
    if (!sb) {
      alert('Formulář byl odeslán (demo – Supabase není nakonfigurován).');
      return;
    }
    const { error } = await sb.from('leads').insert(data);
    if (error) {
      alert('Chyba při odesílání: ' + error.message);
      return;
    }
    alert('Děkujeme! Ozveme se vám do 24 hodin.');
  }

  function initForms() {
    // Rychlý formulář
    document.querySelector('.quick-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const plz = document.getElementById('plz-quick')?.value?.replace(/\s/g, '') || '';
      const region = getRegionFromPlz(plz);
      await submitLead({
        plz,
        region: region || 'other',
        name: document.getElementById('name')?.value,
        phone: document.getElementById('phone')?.value,
        email: document.getElementById('email')?.value,
        source: 'quick'
      });
      e.target.reset();
    });

    // Hlavní formulář
    document.querySelector('.main-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const plz = document.getElementById('plz')?.value?.replace(/\s/g, '') || '';
      const region = getRegionFromPlz(plz);
      await submitLead({
        plz,
        region: region || 'other',
        company: document.getElementById('company')?.value,
        fullname: document.getElementById('fullname')?.value,
        tel: document.getElementById('tel')?.value,
        mail: document.getElementById('mail')?.value,
        city: document.getElementById('city')?.value,
        install_type: document.getElementById('install-type')?.value,
        volume: document.getElementById('volume')?.value,
        note: document.getElementById('note')?.value,
        source: 'main'
      });
      e.target.reset();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }
})();
