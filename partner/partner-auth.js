(function() {
  const config = window.SUPABASE_CONFIG;
  if (!config || !config.url || config.url === 'YOUR_SUPABASE_URL') {
    console.warn('Supabase není nakonfigurován. Nastavte supabase-config.js');
    window.supabaseClient = null;
    return;
  }
  if (typeof supabase === 'undefined') {
    window.supabaseClient = null;
    return;
  }
  const { createClient } = supabase;
  window.supabaseClient = createClient(config.url, config.anonKey);
})();
