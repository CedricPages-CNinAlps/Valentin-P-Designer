'use strict';
/* ============================================================
   CONFIG.JS — Portfolio renderer (GitHub Pages / localStorage)
   Reads config + content from localStorage, falls back to defaults.
============================================================ */

const VP_DEFAULTS = {
  config: {
    site: { name:"Valentin Porlan", tagline:"Designer Graphique & Identité Visuelle", description:"Portfolio de design graphique — création d'identités visuelles, logotypes, supports print et digital.", author:"Valentin Porlan", keywords:"design graphique, identité visuelle, logo, branding", url:"", language:"fr", favicon:"", logo:"", logo_text:"VP" },
    colors: { primary:"#013336", secondary:"#56b578", accent:"#9e9a87", light:"#e0d5c4", text_dark:"#013336", text_light:"#e0d5c4", bg_body:"#faf8f5" },
    fonts: { heading:"Playfair Display", body:"Inter", heading_weight:"700", body_weight:"400" },
    nav: { items:[ {label:"À propos",href:"#about"},{label:"Services",href:"#services"},{label:"Portfolio",href:"#portfolio"},{label:"Contact",href:"#contact"} ] },
    social: { instagram:"", behance:"", linkedin:"", dribbble:"", twitter:"" },
    emailjs: { service_id:"", template_id:"", public_key:"" },
    tracking: { gtm_id:"", gtag_id:"", analytics_ua:"", matomo_tm_url:"", matomo_id:"", tiktok_id:"", custom_head:"", custom_body:"" },
    cookies: { tac_enabled:false, tac_position:"bottom", services:{googlefonts:true} },
    seo: { og_image:"", og_type:"website", twitter_card:"summary_large_image", twitter_site:"", robots:"index, follow", schema_type:"Person", canonical:"" }
  },
  content: {
    hero: { eyebrow:"Designer Graphique", title:"Je donne vie à vos idées", subtitle:"Création d'identités visuelles uniques, de logotypes mémorables et de supports graphiques qui racontent votre histoire.", cta_primary_text:"Voir mes projets", cta_primary_link:"#portfolio", cta_secondary_text:"Me contacter", cta_secondary_link:"#contact", bg_color:"#013336", image:"", show_link_button:false, link_button_text:"En savoir plus", link_button_url:"" },
    about: { eyebrow:"À propos", title:"Passionné par le design depuis toujours", text:"Designer graphique indépendant avec plus de 5 ans d'expérience, je spécialise dans la création d'identités visuelles fortes et cohérentes. Mon approche mêle esthétique contemporaine et stratégie de marque pour des résultats qui marquent les esprits.", skills:["Identité visuelle","Logotype","Print","UI/UX","Motion Design","Typographie"], image:"", bg_color:"#faf8f5", show_link_button:false, link_button_text:"Télécharger mon CV", link_button_url:"" },
    services: { eyebrow:"Services", title:"Ce que je crée pour vous", subtitle:"Des solutions graphiques sur-mesure adaptées à vos besoins et à votre identité.", bg_color:"#013336", show_link_button:false, link_button_text:"", link_button_url:"", items:[ {icon:"🎨",title:"Identité Visuelle",text:"Création complète de chartes graphiques : logo, couleurs, typographies, guidelines.",color:"#56b578"},{icon:"✏️",title:"Logotype",text:"Design de logos uniques et adaptables, déclinés sur tous vos supports.",color:"#9e9a87"},{icon:"📐",title:"Print & Édition",text:"Mise en page de brochures, catalogues, affiches et supports imprimés.",color:"#e0d5c4"},{icon:"💻",title:"Digital & Web",text:"Design d'interfaces, maquettes web et assets pour le digital.",color:"#56b578"},{icon:"🎬",title:"Motion Design",text:"Animations et vidéos graphiques pour valoriser votre marque.",color:"#9e9a87"},{icon:"📦",title:"Packaging",text:"Conception de packagings attractifs et différenciants.",color:"#e0d5c4"} ] },
    portfolio: { eyebrow:"Portfolio", title:"Mes derniers projets", subtitle:"Une sélection de travaux récents qui illustrent mon approche créative.", bg_color:"#faf8f5", show_link_button:false, link_button_text:"", link_button_url:"", items:[ {title:"Invasion of the Poisson Lion",category:"Affiche",images:["public/invasion-of-the-poisson-lion/image-1.jpg","public/invasion-of-the-poisson-lion/image-2.jpg"],color:"#013336",link:""},{title:"Noctulimia",category:"Affiche",images:["public/noctulimia/image-1.png","public/noctulimia/image-2.png","public/noctulimia/image-3.jpg"],color:"#56b578",link:""},{title:"Un piano sous les arbres",category:"Affiche",images:["public/un-piano-sous-les-arbres/image-1.jpg","public/un-piano-sous-les-arbres/image-2.jpg","public/un-piano-sous-les-arbres/image-3.jpg","public/un-piano-sous-les-arbres/image-4.jpg","public/un-piano-sous-les-arbres/image-5.jpg"],color:"#9e9a87",link:""},{title:"Projet 4",category:"Digital",images:[],color:"#e0d5c4",link:""},{title:"Projet 5",category:"Motion",images:[],color:"#013336",link:""},{title:"Projet 6",category:"Packaging",images:[],color:"#56b578",link:""} ] },
    process: { eyebrow:"Processus", title:"Comment je travaille", subtitle:"Une méthode structurée pour des résultats cohérents et efficaces.", bg_color:"#e0d5c4", show_link_button:false, link_button_text:"Démarrer un projet", link_button_url:"#contact", steps:[ {number:"01",title:"Découverte",text:"Échange approfondi sur votre projet, vos valeurs, votre cible et vos objectifs."},{number:"02",title:"Stratégie",text:"Définition du positionnement graphique et de la direction créative."},{number:"03",title:"Création",text:"Design des premières propositions visuelles avec 2 à 3 pistes créatives."},{number:"04",title:"Affinement",text:"Itérations et ajustements selon vos retours jusqu'à la version finale."} ] },
    testimonials: { eyebrow:"Témoignages", title:"Ce que disent mes clients", bg_color:"#013336", show_link_button:false, link_button_text:"", link_button_url:"", items:[ {quote:"Un travail exceptionnel, Valentin a parfaitement saisi l'essence de notre marque.",author:"Marie D.",role:"Directrice Marketing",company:"Entreprise A"},{quote:"Créatif, réactif et professionnel. Notre logo est exactement ce que nous espérions.",author:"Thomas L.",role:"CEO",company:"Startup B"},{quote:"Un vrai sens du détail et une écoute remarquable. Le résultat dépasse nos attentes.",author:"Sophie M.",role:"Fondatrice",company:"Marque C"} ] },
    contact: { eyebrow:"Contact", title:"Démarrons un projet ensemble", subtitle:"Vous avez un projet en tête ? Discutons-en et donnons vie à vos ambitions.", email:"contact@valentinporlan.fr", phone:"", bg_color:"#faf8f5", show_link_button:false, link_button_text:"", link_button_url:"" },
    footer: { text:"© 2024 Valentin Porlan — Designer Graphique. Tous droits réservés.", links:[{label:"Mentions légales",href:"#"},{label:"Politique de confidentialité",href:"#"}], bg_color:"#013336" }
  }
};

/* ---- Helpers ---- */
function mergeDeep(base, over) {
  const out = Object.assign({}, base);
  for (const k in over) {
    if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) && base[k] && typeof base[k] === 'object') {
      out[k] = mergeDeep(base[k], over[k]);
    } else {
      out[k] = over[k];
    }
  }
  return out;
}
function ls(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } }
function esc(s) { const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }
function el(tag, cls, html) { const e=document.createElement(tag); if(cls)e.className=cls; if(html)e.innerHTML=html; return e; }

/* ---- Load config ---- */
const CFG = mergeDeep(VP_DEFAULTS.config,  ls('vp_config')  || {});
const CNT = mergeDeep(VP_DEFAULTS.content, ls('vp_content') || {});

/* ---- Migrate legacy single "image" field to "images" (max 6) ---- */
const MAX_PF_IMAGES = 6;
CNT.portfolio.items = (CNT.portfolio.items || []).map(item => {
  let images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  if (!images.length && item.image) images = [item.image];
  return { ...item, images: images.slice(0, MAX_PF_IMAGES) };
});

/* ============================================================
   THEME — CSS variables + Google Fonts
============================================================ */
(function applyTheme() {
  const r = document.documentElement.style;
  r.setProperty('--color-primary',    CFG.colors.primary);
  r.setProperty('--color-secondary',  CFG.colors.secondary);
  r.setProperty('--color-accent',     CFG.colors.accent);
  r.setProperty('--color-light',      CFG.colors.light);
  r.setProperty('--color-text-dark',  CFG.colors.text_dark);
  r.setProperty('--color-text-light', CFG.colors.text_light);
  r.setProperty('--color-bg-body',    CFG.colors.bg_body);
  r.setProperty('--font-heading', `'${CFG.fonts.heading}', Georgia, serif`);
  r.setProperty('--font-body',    `'${CFG.fonts.body}', system-ui, sans-serif`);

  // Google Fonts
  const families = encodeURIComponent(CFG.fonts.heading) + ':wght@400;600;700;900&family=' + encodeURIComponent(CFG.fonts.body) + ':wght@300;400;500;600';
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
  document.head.appendChild(link);

  // Page meta
  document.documentElement.lang = CFG.site.language || 'fr';
  document.title = `${CFG.site.name} — ${CFG.site.tagline}`;
  const setMeta = (n,v) => { let m=document.querySelector(`meta[name="${n}"]`)||document.querySelector(`meta[property="${n}"]`); if(!m){m=document.createElement('meta'); document.head.appendChild(m); m.setAttribute(n.startsWith('og:')||n.startsWith('twitter:')?'property':'name',n);} m.setAttribute('content',v); };
  setMeta('description', CFG.site.description);
  setMeta('keywords',    CFG.site.keywords);
  setMeta('author',      CFG.site.author);
  setMeta('og:title',    `${CFG.site.name} — ${CFG.site.tagline}`);
  setMeta('og:description', CFG.site.description);
  if (CFG.seo.og_image) setMeta('og:image', CFG.seo.og_image);

  // Favicon
  if (CFG.site.favicon) {
    let fav = document.querySelector("link[rel='icon']");
    if (!fav) { fav=document.createElement('link'); fav.rel='icon'; document.head.appendChild(fav); }
    fav.href = CFG.site.favicon;
  }
})();

/* ============================================================
   ICONS
============================================================ */
const SOCIAL_ICONS = {
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  behance:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-2.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/></svg>`,
  linkedin:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  dribbble:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>`,
  twitter:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.622 5.905-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>`,
};

function socialLinks(cls='social-link') {
  return Object.entries(SOCIAL_ICONS).map(([k, icon]) =>
    CFG.social[k] ? `<a href="${esc(CFG.social[k])}" class="${cls}" target="_blank" rel="noopener noreferrer" aria-label="${k}">${icon}</a>` : ''
  ).join('');
}

/* ============================================================
   RENDER — NAV
============================================================ */
(function renderNav() {
  const logoEl = document.getElementById('navLogo');
  if (logoEl) {
    logoEl.innerHTML = CFG.site.logo
      ? `<img src="${esc(CFG.site.logo)}" alt="Logo ${esc(CFG.site.name)}" class="logo-img">`
      : `<span class="logo-text">${esc(CFG.site.logo_text || CFG.site.name.substring(0,2))}</span>`;
  }
  const menuEl = document.getElementById('nav-menu');
  if (menuEl) {
    menuEl.innerHTML = CFG.nav.items.map(item =>
      `<li><a href="${esc(item.href)}" class="nav-link">${esc(item.label)}</a></li>`
    ).join('') + `<li><a href="#contact" class="nav-cta">Travaillons ensemble</a></li>`;
  }
})();

/* ============================================================
   RENDER — HERO
============================================================ */
(function renderHero() {
  const h = CNT.hero;
  const s = document.getElementById('hero');
  if (!s) return;
  s.style.backgroundColor = h.bg_color || CFG.colors.primary;
  s.innerHTML = `
    <div class="hero-bg-blobs" aria-hidden="true"><div class="blob blob-1"></div><div class="blob blob-2"></div><div class="blob blob-3"></div></div>
    <div class="hero-container">
      <div class="hero-glass-card" data-aos="fade-up">
        <span class="hero-eyebrow" data-aos="fade-down" data-aos-delay="100">${esc(h.eyebrow)}</span>
        <h1 class="hero-title" data-aos="fade-up" data-aos-delay="200">${esc(h.title)}</h1>
        <p class="hero-subtitle" data-aos="fade-up" data-aos-delay="300">${esc(h.subtitle)}</p>
        <div class="hero-actions" data-aos="fade-up" data-aos-delay="400">
          ${h.cta_primary_text ? `<a href="${esc(h.cta_primary_link)}" class="btn btn-primary">${esc(h.cta_primary_text)}</a>` : ''}
          ${h.cta_secondary_text ? `<a href="${esc(h.cta_secondary_link)}" class="btn btn-ghost">${esc(h.cta_secondary_text)}</a>` : ''}
          ${h.show_link_button && h.link_button_url ? `<a href="${esc(h.link_button_url)}" class="btn btn-link-block" target="_blank" rel="noopener noreferrer">${esc(h.link_button_text)}</a>` : ''}
        </div>
      </div>
      ${h.image ? `<div class="hero-image-wrap" data-aos="fade-left" data-aos-delay="300"><img src="${esc(h.image)}" alt="${esc(CFG.site.author)}" class="hero-image"></div>` : ''}
    </div>
    <div class="hero-scroll-indicator" aria-hidden="true"><div class="scroll-line"></div></div>`;
})();

/* ============================================================
   RENDER — ABOUT
============================================================ */
(function renderAbout() {
  const a = CNT.about; const s = document.getElementById('about');
  if (!s) return;
  s.style.backgroundColor = a.bg_color || CFG.colors.bg_body;
  s.innerHTML = `<div class="container"><div class="section-inner about-grid">
    ${a.image ? `<div class="about-visual" data-aos="fade-right"><div class="about-image-wrap"><img src="${esc(a.image)}" alt="${esc(CFG.site.author)}" class="about-image"><div class="about-image-deco" aria-hidden="true"></div></div></div>` : ''}
    <div class="about-content" data-aos="fade-left">
      <span class="section-eyebrow">${esc(a.eyebrow)}</span>
      <h2 class="section-title">${esc(a.title)}</h2>
      <p class="section-text">${esc(a.text)}</p>
      ${a.skills?.length ? `<ul class="skills-list" role="list">${a.skills.map(sk=>`<li class="skill-tag">${esc(sk)}</li>`).join('')}</ul>` : ''}
      ${a.show_link_button && a.link_button_url ? `<a href="${esc(a.link_button_url)}" class="btn btn-primary mt-2" target="_blank" rel="noopener noreferrer">${esc(a.link_button_text)}</a>` : ''}
    </div>
  </div></div>`;
})();

/* ============================================================
   RENDER — SERVICES
============================================================ */
(function renderServices() {
  const sv = CNT.services; const s = document.getElementById('services');
  if (!s) return;
  s.style.backgroundColor = sv.bg_color || CFG.colors.primary;
  s.innerHTML = `<div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="section-eyebrow light">${esc(sv.eyebrow)}</span>
      <h2 class="section-title light">${esc(sv.title)}</h2>
      ${sv.subtitle ? `<p class="section-subtitle light">${esc(sv.subtitle)}</p>` : ''}
    </div>
    <div class="services-grid">
      ${sv.items.map((item,i) => `
        <article class="service-card" data-aos="fade-up" data-aos-delay="${i*80}">
          <div class="service-icon" style="background:${esc(item.color)}20;color:${esc(item.color)}">${esc(item.icon)}</div>
          <h3 class="service-title">${esc(item.title)}</h3>
          <p class="service-text">${esc(item.text)}</p>
          <div class="service-accent" style="background:${esc(item.color)}"></div>
        </article>`).join('')}
    </div>
    ${sv.show_link_button && sv.link_button_url ? `<div class="section-cta"><a href="${esc(sv.link_button_url)}" class="btn btn-secondary">${esc(sv.link_button_text)}</a></div>` : ''}
  </div>`;
})();

/* ============================================================
   RENDER — PORTFOLIO
============================================================ */
(function renderPortfolio() {
  const pf = CNT.portfolio; const s = document.getElementById('portfolio');
  if (!s) return;
  s.style.backgroundColor = pf.bg_color || CFG.colors.bg_body;
  const cats = [...new Set(pf.items.map(i => i.category))];
  s.innerHTML = `<div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="section-eyebrow">${esc(pf.eyebrow)}</span>
      <h2 class="section-title">${esc(pf.title)}</h2>
      ${pf.subtitle ? `<p class="section-subtitle">${esc(pf.subtitle)}</p>` : ''}
    </div>
    <div class="portfolio-filter" role="tablist">
      <button class="filter-btn active" data-filter="all" role="tab" aria-selected="true">Tous</button>
      ${cats.map(c=>`<button class="filter-btn" data-filter="${esc(c.toLowerCase())}" role="tab" aria-selected="false">${esc(c)}</button>`).join('')}
    </div>
    <div class="portfolio-grid" role="list">
      ${pf.items.map((item,i) => {
        const images = item.images || [];
        const cover  = images[0];
        return `
        <article class="portfolio-card" data-category="${esc(item.category.toLowerCase())}" data-index="${i}" data-aos="fade-up" data-aos-delay="${i*60}" role="listitem" ${images.length ? `tabindex="0" aria-label="Voir les images du projet ${esc(item.title)}"` : ''}>
          <div class="portfolio-img-wrap" style="background:${esc(item.color)}">
            ${cover ? `<img src="${esc(cover)}" alt="${esc(item.title)}" class="portfolio-img" loading="lazy">` : `<div class="portfolio-placeholder" aria-hidden="true"><span class="portfolio-placeholder-letter">${esc(item.title.charAt(0))}</span></div>`}
            ${images.length > 1 ? `<span class="portfolio-count" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M7 21h11a2 2 0 0 0 2-2V7"/></svg>${images.length}</span>` : ''}
            <div class="portfolio-overlay">
              <h3 class="portfolio-title">${esc(item.title)}</h3>
              <span class="portfolio-category">${esc(item.category)}</span>
              ${item.link ? `<a href="${esc(item.link)}" class="portfolio-link" target="_blank" rel="noopener noreferrer" aria-label="Voir ${esc(item.title)}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
            </div>
          </div>
        </article>`;
      }).join('')}
    </div>
    ${pf.show_link_button && pf.link_button_url ? `<div class="section-cta"><a href="${esc(pf.link_button_url)}" class="btn btn-primary">${esc(pf.link_button_text)}</a></div>` : ''}
  </div>`;

  /* Expose per-project galleries for the lightbox (see main.js) */
  window.VP_PORTFOLIO_GALLERIES = pf.items.map(item => ({ title: item.title, category: item.category, images: item.images || [] }));
})();

/* ============================================================
   RENDER — PROCESS
============================================================ */
(function renderProcess() {
  const pr = CNT.process; const s = document.getElementById('process');
  if (!s) return;
  s.style.backgroundColor = pr.bg_color || CFG.colors.light;
  s.innerHTML = `<div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="section-eyebrow">${esc(pr.eyebrow)}</span>
      <h2 class="section-title">${esc(pr.title)}</h2>
      ${pr.subtitle ? `<p class="section-subtitle">${esc(pr.subtitle)}</p>` : ''}
    </div>
    <div class="process-steps">
      ${pr.steps.map((step,i)=>`
        <div class="process-step" data-aos="fade-up" data-aos-delay="${i*100}">
          <div class="step-number" aria-hidden="true">${esc(step.number)}</div>
          <div class="step-content"><h3 class="step-title">${esc(step.title)}</h3><p class="step-text">${esc(step.text)}</p></div>
        </div>`).join('')}
    </div>
    ${pr.show_link_button && pr.link_button_url ? `<div class="section-cta"><a href="${esc(pr.link_button_url)}" class="btn btn-primary">${esc(pr.link_button_text)}</a></div>` : ''}
  </div>`;
})();

/* ============================================================
   RENDER — TESTIMONIALS
============================================================ */
(function renderTestimonials() {
  const t = CNT.testimonials; const s = document.getElementById('testimonials');
  if (!s) return;
  s.style.backgroundColor = t.bg_color || CFG.colors.primary;
  s.innerHTML = `<div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="section-eyebrow light">${esc(t.eyebrow)}</span>
      <h2 class="section-title light">${esc(t.title)}</h2>
    </div>
    <div class="testimonials-grid">
      ${t.items.map((item,i)=>`
        <blockquote class="testimonial-card" data-aos="fade-up" data-aos-delay="${i*100}">
          <div class="quote-icon" aria-hidden="true">"</div>
          <p class="testimonial-quote">${esc(item.quote)}</p>
          <footer class="testimonial-author">
            <strong>${esc(item.author)}</strong>
            <span>${esc(item.role)}</span>${item.company ? ` — <span>${esc(item.company)}</span>` : ''}
          </footer>
        </blockquote>`).join('')}
    </div>
  </div>`;
})();

/* ============================================================
   RENDER — CONTACT
============================================================ */
(function renderContact() {
  const c = CNT.contact; const s = document.getElementById('contact');
  if (!s) return;
  s.style.backgroundColor = c.bg_color || CFG.colors.bg_body;
  s.innerHTML = `<div class="container"><div class="contact-wrapper">
    <div class="contact-info" data-aos="fade-right">
      <span class="section-eyebrow">${esc(c.eyebrow)}</span>
      <h2 class="section-title">${esc(c.title)}</h2>
      <p class="section-text">${esc(c.subtitle)}</p>
      <div class="contact-details">
        ${c.email ? `<a href="mailto:${esc(c.email)}" class="contact-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>${esc(c.email)}</a>` : ''}
        ${c.phone ? `<a href="tel:${esc(c.phone.replace(/\s/g,''))}" class="contact-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.574 2.81.7A2 2 0 0 1 22 16.92z"/></svg>${esc(c.phone)}</a>` : ''}
      </div>
      <div class="social-links">${socialLinks()}</div>
    </div>
    <div class="contact-form-wrap" data-aos="fade-left">
      <form class="contact-form" id="contact-form" novalidate>
        <div class="form-group"><label for="contact-name" class="form-label">Nom complet <span aria-hidden="true">*</span></label><input type="text" id="contact-name" name="from_name" class="form-input" required autocomplete="name" placeholder="Votre nom"></div>
        <div class="form-group"><label for="contact-email" class="form-label">Email <span aria-hidden="true">*</span></label><input type="email" id="contact-email" name="from_email" class="form-input" required autocomplete="email" placeholder="votre@email.com"></div>
        <div class="form-group"><label for="contact-subject" class="form-label">Sujet</label><input type="text" id="contact-subject" name="subject" class="form-input" placeholder="Votre projet"></div>
        <div class="form-group"><label for="contact-message" class="form-label">Message <span aria-hidden="true">*</span></label><textarea id="contact-message" name="message" class="form-input form-textarea" required rows="5" placeholder="Décrivez votre projet..."></textarea></div>
        <button type="submit" class="btn btn-primary btn-full" id="contact-submit"><span class="btn-text">Envoyer le message</span><span class="btn-loading" hidden>Envoi en cours...</span></button>
        <div class="form-message" id="form-message" role="alert" aria-live="polite"></div>
      </form>
    </div>
  </div></div>`;
})();

/* ============================================================
   RENDER — FOOTER
============================================================ */
(function renderFooter() {
  const f = CNT.footer; const s = document.getElementById('site-footer');
  if (!s) return;
  s.style.backgroundColor = f.bg_color || CFG.colors.primary;
  const logoTxt = CFG.site.logo_text || CFG.site.name.substring(0,2);
  s.innerHTML = `<div class="footer-container">
    <div class="footer-brand">
      <a href="#top" class="footer-logo"><span class="logo-text">${esc(logoTxt)}</span></a>
      <p class="footer-tagline">${esc(CFG.site.tagline)}</p>
    </div>
    <div class="footer-social">${socialLinks()}</div>
    <div class="footer-bottom">
      <p>${esc(f.text)}</p>
      <nav>${f.links.map(l=>`<a href="${esc(l.href)}" class="footer-legal-link">${esc(l.label)}</a>`).join('')}</nav>
    </div>
  </div>`;
})();

/* ============================================================
   EMAILJS CONFIG
============================================================ */
window.EMAILJS_CONFIG = {
  service_id:  CFG.emailjs.service_id,
  template_id: CFG.emailjs.template_id,
  public_key:  CFG.emailjs.public_key,
};
if (CFG.emailjs.public_key) {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload = () => emailjs.init(CFG.emailjs.public_key);
  document.head.appendChild(s);
}

/* ============================================================
   TARTE AU CITRON
============================================================ */
if (CFG.cookies.tac_enabled) {
  const tacCss = document.createElement('link');
  tacCss.rel = 'stylesheet';
  tacCss.href = 'https://cdn.jsdelivr.net/npm/tarteaucitronjs@1.19.0/css/tarteaucitron.css';
  document.head.appendChild(tacCss);
  const tacJs = document.createElement('script');
  tacJs.src = 'https://cdn.jsdelivr.net/npm/tarteaucitronjs@1.19.0/tarteaucitron.js';
  tacJs.onload = () => {
    tarteaucitron.init({ bodyPosition: CFG.cookies.tac_position || 'bottom', highPrivacy: true, DenyAllCta: true, AcceptAllCta: true, mandatory: true });
    const sv = CFG.cookies.services || {};
    if (sv.googlefonts) { tarteaucitron.user.googleFonts = encodeURIComponent(CFG.fonts.heading)+'|'+encodeURIComponent(CFG.fonts.body); (tarteaucitron.job=tarteaucitron.job||[]).push('googlefonts'); }
    if (sv.googletagmanager && CFG.tracking.gtm_id) { tarteaucitron.user.googletagmanagerId=CFG.tracking.gtm_id; (tarteaucitron.job=tarteaucitron.job||[]).push('googletagmanager'); }
    if (sv.gtag && CFG.tracking.gtag_id) { tarteaucitron.user.gtagUa=CFG.tracking.gtag_id; (tarteaucitron.job=tarteaucitron.job||[]).push('gtag'); }
    if (sv.matomo && CFG.tracking.matomo_id) { tarteaucitron.user.matomoId=CFG.tracking.matomo_id; (tarteaucitron.job=tarteaucitron.job||[]).push('matomo'); }
    if (sv.tiktok && CFG.tracking.tiktok_id) { tarteaucitron.user.tiktokId=CFG.tracking.tiktok_id; (tarteaucitron.job=tarteaucitron.job||[]).push('tiktok'); }
    if (sv.facebook) { (tarteaucitron.job=tarteaucitron.job||[]).push('facebook'); }
    if (sv.twitter) { (tarteaucitron.job=tarteaucitron.job||[]).push('twitter'); }
  };
  document.head.appendChild(tacJs);
}

/* Custom tracking */
if (CFG.tracking.custom_head) {
  const div = document.createElement('div'); div.innerHTML = CFG.tracking.custom_head;
  div.querySelectorAll('script').forEach(sc => { const ns=document.createElement('script'); ns.text=sc.text; document.head.appendChild(ns); });
}
