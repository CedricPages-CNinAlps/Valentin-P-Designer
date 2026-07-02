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
   PORTFOLIO LIGHTBOX GALLERY
============================================= */
(function () {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;

  let lb, gallery = null, index = 0, triggerEl = null;

  function escAttr(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML.replace(/"/g, '&quot;'); }

  function buildLightbox() {
    lb = document.createElement('div');
    lb.className = 'pf-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = `
      <button class="pf-lightbox-close" aria-label="Fermer la galerie">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <button class="pf-lightbox-nav pf-lightbox-prev" aria-label="Image précédente">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="pf-lightbox-stage">
        <img class="pf-lightbox-img" src="" alt="">
      </div>
      <button class="pf-lightbox-nav pf-lightbox-next" aria-label="Image suivante">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div class="pf-lightbox-info">
        <div class="pf-lightbox-text">
          <h3 class="pf-lightbox-title"></h3>
          <span class="pf-lightbox-category"></span>
        </div>
        <span class="pf-lightbox-counter"></span>
      </div>
      <div class="pf-lightbox-thumbs"></div>`;
    document.body.appendChild(lb);

    lb.querySelector('.pf-lightbox-close').addEventListener('click', closeGallery);
    lb.querySelector('.pf-lightbox-prev').addEventListener('click', () => show(index - 1));
    lb.querySelector('.pf-lightbox-next').addEventListener('click', () => show(index + 1));
    lb.addEventListener('click', e => { if (e.target === lb) closeGallery(); });

    /* Swipe */
    let touchX = null;
    const stage = lb.querySelector('.pf-lightbox-stage');
    stage.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (touchX === null) return;
      const delta = e.changedTouches[0].clientX - touchX;
      if (Math.abs(delta) > 40) show(index + (delta < 0 ? 1 : -1));
      touchX = null;
    }, { passive: true });
  }

  function show(i) {
    const total = gallery.images.length;
    index = (i + total) % total;
    const img = lb.querySelector('.pf-lightbox-img');
    img.classList.remove('loaded');
    img.src = gallery.images[index];
    img.alt = `${gallery.title} — image ${index + 1}/${total}`;
    lb.querySelector('.pf-lightbox-counter').textContent = `${index + 1} / ${total}`;
    requestAnimationFrame(() => img.classList.add('loaded'));
    lb.querySelectorAll('.pf-lightbox-thumb').forEach((t, ti) => t.classList.toggle('active', ti === index));
    lb.querySelectorAll('.pf-lightbox-thumb.active')[0]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    const nav = total > 1;
    lb.querySelector('.pf-lightbox-prev').hidden = !nav;
    lb.querySelector('.pf-lightbox-next').hidden = !nav;
  }

  function openGallery(i, el) {
    gallery = window.VP_PORTFOLIO_GALLERIES?.[i];
    if (!gallery || !gallery.images.length) return;
    if (!lb) buildLightbox();
    triggerEl = el;
    lb.querySelector('.pf-lightbox-title').textContent = gallery.title;
    lb.querySelector('.pf-lightbox-category').textContent = gallery.category;
    lb.querySelector('.pf-lightbox-thumbs').innerHTML = gallery.images.map((src, ti) =>
      `<button class="pf-lightbox-thumb" aria-label="Image ${ti + 1}"><img src="${escAttr(src)}" alt="" loading="lazy"></button>`).join('');
    lb.querySelectorAll('.pf-lightbox-thumb').forEach((t, ti) => t.addEventListener('click', () => show(ti)));
    show(0);
    document.body.classList.add('pf-lightbox-open');
    lb.classList.add('open');
    lb.querySelector('.pf-lightbox-close').focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeGallery() {
    if (!lb) return;
    lb.classList.remove('open');
    document.body.classList.remove('pf-lightbox-open');
    document.removeEventListener('keydown', onKeydown);
    triggerEl?.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  }

  grid.addEventListener('click', e => {
    if (e.target.closest('.portfolio-link')) return;
    const card = e.target.closest('.portfolio-card');
    if (!card) return;
    openGallery(parseInt(card.dataset.index, 10), card);
  });

  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.portfolio-card');
    if (!card) return;
    e.preventDefault();
    openGallery(parseInt(card.dataset.index, 10), card);
  });
})();

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
