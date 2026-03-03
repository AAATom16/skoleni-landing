(function() {
  const sb = window.supabaseClient;
  if (!sb) return;

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('loginError');
    errEl.classList.remove('show');
    errEl.textContent = '';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      errEl.textContent = error.message === 'Invalid login credentials' ? 'Nesprávný e-mail nebo heslo.' : error.message;
      errEl.classList.add('show');
      return;
    }
    window.location.href = 'dashboard.html';
  });
})();
