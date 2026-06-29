'use strict';

/* =============================================
   NAVIGATION — sticky + mobile toggle
============================================= */
const header    = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-menu');
const navLinks  = document.querySelectorAll('.nav-link, .nav-cta');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* Close mobile menu on outside click */
document.addEventListener('click', e => {
  if (!header.contains(e.target) && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

/* Active nav link on scroll */
const sections = document.querySelectorAll('section[id]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active-link', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => observer.observe(s));

/* =============================================
   BACK TO TOP
============================================= */
document.getElementById('backToTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================
   SCROLL ANIMATIONS (lightweight AOS-like)
============================================= */
const animEls = document.querySelectorAll('[data-aos]');
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.aosDelay || 0;
      setTimeout(() => entry.target.classList.add('animated'), parseInt(delay));
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
animEls.forEach(el => animObserver.observe(el));

/* =============================================
   PORTFOLIO FILTER
============================================= */
const filterBtns  = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;
    portfolioCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
      if (match) {
        card.style.animation = 'fadeIn .4s ease both';
      }
    });
  });
});

/* =============================================
   CONTACT FORM — EmailJS
============================================= */
const contactForm   = document.getElementById('contact-form');
const contactSubmit = document.getElementById('contact-submit');
const formMessage   = document.getElementById('form-message');
const btnText       = contactSubmit?.querySelector('.btn-text');
const btnLoading    = contactSubmit?.querySelector('.btn-loading');

function showFormMessage(msg, type) {
  formMessage.textContent = msg;
  formMessage.className = 'form-message ' + type;
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function validateForm() {
  let valid = true;
  contactForm.querySelectorAll('[required]').forEach(input => {
    const ok = input.value.trim() !== '' &&
      (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
    input.classList.toggle('error', !ok);
    if (!ok) valid = false;
  });
  return valid;
}

contactForm?.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validateForm()) {
    showFormMessage('Merci de remplir tous les champs obligatoires.', 'error');
    return;
  }

  const cfg = window.EMAILJS_CONFIG;
  if (!cfg || !cfg.service_id || !cfg.template_id || !cfg.public_key) {
    showFormMessage('Le formulaire n\'est pas encore configuré (EmailJS requis).', 'error');
    return;
  }

  btnText.hidden   = true;
  btnLoading.hidden = false;
  contactSubmit.disabled = true;
  formMessage.className = 'form-message';

  try {
    const params = {
      from_name:  contactForm.querySelector('[name=from_name]').value.trim(),
      from_email: contactForm.querySelector('[name=from_email]').value.trim(),
      subject:    contactForm.querySelector('[name=subject]')?.value.trim() || 'Nouveau message',
      message:    contactForm.querySelector('[name=message]').value.trim(),
    };

    await emailjs.send(cfg.service_id, cfg.template_id, params);
    showFormMessage('Message envoyé avec succès ! Je vous répondrai rapidement.', 'success');
    contactForm.reset();
  } catch (err) {
    console.error('EmailJS error:', err);
    showFormMessage('Une erreur est survenue. Veuillez réessayer ou m\'écrire directement par email.', 'error');
  } finally {
    btnText.hidden   = false;
    btnLoading.hidden = true;
    contactSubmit.disabled = false;
  }
});

/* Remove error class on input */
contactForm?.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('input', () => input.classList.remove('error'));
});
