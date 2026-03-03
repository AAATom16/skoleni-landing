(function() {
  const sb = window.supabaseClient;
  if (!sb) {
    document.getElementById('loading').innerHTML = 'Supabase není nakonfigurován.';
    return;
  }

  async function init() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    const { data: partner } = await sb.from('partners').select('id, name, region').eq('user_id', user.id).single();
    if (!partner) {
      document.getElementById('loading').innerHTML = 'Nemáte přiřazený partner účet. Kontaktujte administrátora.';
      return;
    }

    document.getElementById('regionBadge').textContent = partner.region;

    const { data: leads, error } = await sb.from('leads').select('*').eq('partner_id', partner.id).order('created_at', { ascending: false });

    document.getElementById('loading').style.display = 'none';
    const container = document.getElementById('leadsList');

    if (error) {
      container.innerHTML = '<div class="empty-state"><p>Chyba při načítání: ' + error.message + '</p></div>';
      return;
    }

    if (!leads || leads.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Zatím nemáte žádné leady.</p><p>Leady se zobrazí po odeslání poptávky zákazníky ve vašem regionu (PLZ).</p></div>';
      return;
    }

    container.innerHTML = leads.map(lead => {
      const name = lead.fullname || lead.name || '–';
      const phone = lead.tel || lead.phone || '–';
      const email = lead.mail || lead.email || '–';
      const company = lead.company || '–';
      const city = lead.city || '–';
      const date = new Date(lead.created_at).toLocaleString('cs-CZ');
      return `
        <div class="lead-card">
          <h3>${escapeHtml(name)}</h3>
          <div class="lead-meta">PLZ ${escapeHtml(lead.plz)} · ${date}</div>
          <div class="lead-details">
            <div><strong>Firma:</strong> ${escapeHtml(company)}</div>
            <div><strong>Telefon:</strong> ${escapeHtml(phone)}</div>
            <div><strong>E-mail:</strong> ${escapeHtml(email)}</div>
            <div><strong>Město:</strong> ${escapeHtml(city)}</div>
            ${lead.install_type ? `<div><strong>Typ instalace:</strong> ${escapeHtml(lead.install_type)}</div>` : ''}
            ${lead.note ? `<div><strong>Poznámka:</strong> ${escapeHtml(lead.note)}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  document.getElementById('logoutBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    if (sb) await sb.auth.signOut();
    window.location.href = 'login.html';
  });

  init();
})();
