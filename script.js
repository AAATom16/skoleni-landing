// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const navMobile = document.getElementById('navMobile');
if (menuBtn && navMobile) {
  menuBtn.addEventListener('click', () => navMobile.classList.toggle('open'));
}
if (navMobile) {
  navMobile.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => navMobile.classList.remove('open'));
  });
}

// FAQ Accordion
document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Form submit je v forms-submit.js (Supabase)
