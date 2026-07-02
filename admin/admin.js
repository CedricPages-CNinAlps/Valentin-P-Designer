'use strict';
/* ============================================================
   ADMIN.JS — GitHub Pages version (localStorage)
============================================================ */

/* ---- Auth guard ---- */
if (sessionStorage.getItem('vp_admin_session') !== '1') { location.href = 'index.html'; }

/* ---- Defaults (mirrors config.js VP_DEFAULTS) ---- */
const DEF_CFG = { site:{name:"Valentin Porlan",tagline:"Designer Graphique & Identité Visuelle",description:"Portfolio de design graphique.",author:"Valentin Porlan",keywords:"design graphique, identité visuelle, logo",url:"",language:"fr",favicon:"",logo:"",logo_text:"VP"}, colors:{primary:"#013336",secondary:"#56b578",accent:"#9e9a87",light:"#e0d5c4",text_dark:"#013336",text_light:"#e0d5c4",bg_body:"#faf8f5"}, fonts:{heading:"Playfair Display",body:"Inter",heading_weight:"700",body_weight:"400"}, nav:{items:[{label:"À propos",href:"#about"},{label:"Services",href:"#services"},{label:"Portfolio",href:"#portfolio"},{label:"Contact",href:"#contact"}]}, social:{instagram:"",behance:"",linkedin:"",dribbble:"",twitter:""}, emailjs:{service_id:"",template_id:"",public_key:""}, tracking:{gtm_id:"",gtag_id:"",analytics_ua:"",matomo_tm_url:"",matomo_id:"",tiktok_id:"",googlemaps_key:"",custom_head:"",custom_body:""}, cookies:{tac_enabled:false,tac_position:"bottom",services:{googlefonts:true,googletagmanager:false,gtag:false,analytics:false,matomotm:false,matomo:false,facebook:false,facebookpost:false,twitter:false,twitterembed:false,tiktok:false,tiktokvideo:false}}, seo:{og_image:"",og_type:"website",twitter_card:"summary_large_image",twitter_site:"",robots:"index, follow",schema_type:"Person",canonical:""} };
const DEF_CNT = { hero:{eyebrow:"Designer Graphique",title:"Je donne vie à vos idées",subtitle:"Création d'identités visuelles uniques.",cta_primary_text:"Voir mes projets",cta_primary_link:"#portfolio",cta_secondary_text:"Me contacter",cta_secondary_link:"#contact",bg_color:"#013336",image:"",show_link_button:false,link_button_text:"En savoir plus",link_button_url:""}, about:{eyebrow:"À propos",title:"Passionné par le design",text:"Designer graphique indépendant...",skills:["Identité visuelle","Logotype","Print","UI/UX","Motion Design","Typographie"],image:"",bg_color:"#faf8f5",show_link_button:false,link_button_text:"",link_button_url:""}, services:{eyebrow:"Services",title:"Ce que je crée",subtitle:"",bg_color:"#013336",show_link_button:false,link_button_text:"",link_button_url:"",items:[{icon:"🎨",title:"Identité Visuelle",text:"Chartes graphiques complètes.",color:"#56b578"},{icon:"✏️",title:"Logotype",text:"Logos uniques.",color:"#9e9a87"},{icon:"📐",title:"Print & Édition",text:"Supports imprimés.",color:"#e0d5c4"},{icon:"💻",title:"Digital & Web",text:"Interfaces et assets.",color:"#56b578"},{icon:"🎬",title:"Motion Design",text:"Animations et vidéos.",color:"#9e9a87"},{icon:"📦",title:"Packaging",text:"Packagings distinctifs.",color:"#e0d5c4"}]}, portfolio:{eyebrow:"Portfolio",title:"Mes derniers projets",subtitle:"",bg_color:"#faf8f5",show_link_button:false,link_button_text:"",link_button_url:"",items:[{title:"Invasion of the Poisson Lion",category:"Affiche",images:["public/invasion-of-the-poisson-lion/image-1.jpg","public/invasion-of-the-poisson-lion/image-2.jpg"],color:"#013336",link:""},{title:"Noctulimia",category:"Affiche",images:["public/noctulimia/image-1.png","public/noctulimia/image-2.png","public/noctulimia/image-3.jpg"],color:"#56b578",link:""},{title:"Un piano sous les arbres",category:"Affiche",images:["public/un-piano-sous-les-arbres/image-1.jpg","public/un-piano-sous-les-arbres/image-2.jpg","public/un-piano-sous-les-arbres/image-3.jpg","public/un-piano-sous-les-arbres/image-4.jpg","public/un-piano-sous-les-arbres/image-5.jpg"],color:"#9e9a87",link:""},{title:"Projet 4",category:"Digital",images:[],color:"#e0d5c4",link:""},{title:"Projet 5",category:"Motion",images:[],color:"#013336",link:""},{title:"Projet 6",category:"Packaging",images:[],color:"#56b578",link:""}]}, process:{eyebrow:"Processus",title:"Comment je travaille",subtitle:"",bg_color:"#e0d5c4",show_link_button:false,link_button_text:"Démarrer",link_button_url:"#contact",steps:[{number:"01",title:"Découverte",text:"Échange sur votre projet."},{number:"02",title:"Stratégie",text:"Direction créative."},{number:"03",title:"Création",text:"Premières propositions."},{number:"04",title:"Affinement",text:"Itérations et livraison."}]}, testimonials:{eyebrow:"Témoignages",title:"Ce que disent mes clients",bg_color:"#013336",show_link_button:false,link_button_text:"",link_button_url:"",items:[{quote:"Un travail exceptionnel.",author:"Marie D.",role:"Directrice Marketing",company:"Entreprise A"},{quote:"Créatif et professionnel.",author:"Thomas L.",role:"CEO",company:"Startup B"},{quote:"Le résultat dépasse nos attentes.",author:"Sophie M.",role:"Fondatrice",company:"Marque C"}]}, contact:{eyebrow:"Contact",title:"Démarrons un projet",subtitle:"Discutons de votre projet.",email:"contact@valentinporlan.fr",phone:"",bg_color:"#faf8f5",show_link_button:false,link_button_text:"",link_button_url:""}, footer:{text:"© 2024 Valentin Porlan — Designer Graphique. Tous droits réservés.",links:[{label:"Mentions légales",href:"#"},{label:"Politique de confidentialité",href:"#"}],bg_color:"#013336"} };

/* ---- Deep merge ---- */
function mergeDeep(base, over) {
  const out = Object.assign({}, base);
  for (const k in over) {
    if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) && base[k] && typeof base[k] === 'object') {
      out[k] = mergeDeep(base[k], over[k]);
    } else { out[k] = over[k]; }
  }
  return out;
}
function setNested(obj, path, val) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) { if (!cur[keys[i]]) cur[keys[i]] = {}; cur = cur[keys[i]]; }
  cur[keys[keys.length - 1]] = val;
}
function getNested(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

/* ---- Load / Save state ---- */
let CFG = mergeDeep(DEF_CFG, JSON.parse(localStorage.getItem('vp_config') || '{}'));
let CNT = mergeDeep(DEF_CNT, JSON.parse(localStorage.getItem('vp_content') || '{}'));

/* ---- Migrate legacy single "image" field to "images" (max 6) ---- */
const MAX_PF_IMAGES = 6;
CNT.portfolio.items = (CNT.portfolio.items || []).map(item => {
  let images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  if (!images.length && item.image) images = [item.image];
  const { image, ...rest } = item;
  return { ...rest, images: images.slice(0, MAX_PF_IMAGES) };
});

let DIRTY = false;
let saveTimer;

function markDirty() {
  DIRTY = true;
  clearTimeout(saveTimer);
  setSaveStatus('saving', 'Modifications...');
  saveTimer = setTimeout(autoSave, 2000);
}

function setSaveStatus(cls, msg) {
  const el = document.getElementById('saveStatus');
  el.textContent = msg;
  el.className = 'save-status ' + cls;
}

function autoSave() {
  if (!DIRTY) return;
  collectAll();
  localStorage.setItem('vp_config',  JSON.stringify(CFG));
  localStorage.setItem('vp_content', JSON.stringify(CNT));
  DIRTY = false;
  setSaveStatus('saved', '✓ Sauvegardé');
  setTimeout(() => { if (!DIRTY) setSaveStatus('', ''); }, 3000);
}

document.getElementById('saveBtn').addEventListener('click', autoSave);
window.addEventListener('beforeunload', e => { if (DIRTY) { e.preventDefault(); e.returnValue = ''; } });

/* ---- Apply current theme to admin ---- */
(function applyAdminTheme() {
  const r = document.documentElement.style;
  r.setProperty('--color-primary',   CFG.colors.primary);
  r.setProperty('--color-secondary', CFG.colors.secondary);
  r.setProperty('--color-light',     CFG.colors.light);
  const lt = CFG.site.logo_text || 'VP';
  const el = document.getElementById('sidebarLogo');
  if (el) el.textContent = lt;
})();

/* ============================================================
   SIDEBAR & TABS
============================================================ */
const sidebar = document.getElementById('adminSidebar');
document.getElementById('sidebarToggle')?.addEventListener('click', () => sidebar.classList.toggle('open'));
document.getElementById('sidebarClose')?.addEventListener('click',  () => sidebar.classList.remove('open'));

const tabTitles = { general:'Général', appearance:'Apparence', content:'Contenu', seo:'SEO', emailjs:'EmailJS', tracking:'Tracking', cookies:'Cookies', security:'Sécurité' };
document.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.sidebar-link[data-tab]').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    link.classList.add('active');
    document.getElementById('tab-' + link.dataset.tab)?.classList.add('active');
    document.getElementById('pageTitle').textContent = tabTitles[link.dataset.tab] || '';
    sidebar.classList.remove('open');
  });
});

/* ============================================================
   BIND FIELDS to CFG/CNT
============================================================ */
function bindFields() {
  /* Config fields */
  document.querySelectorAll('[data-cfg]').forEach(el => {
    const path = el.dataset.cfg;
    const val  = getNested(CFG, path);
    if (val !== undefined) el.value = val;
    el.addEventListener('input', () => markDirty());
    el.addEventListener('change', () => markDirty());
  });

  /* Config booleans */
  document.querySelectorAll('[data-cfg-bool]').forEach(el => {
    const path = el.dataset.cfgBool;
    el.checked = !!getNested(CFG, path);
    el.addEventListener('change', () => markDirty());
  });

  /* Content fields */
  document.querySelectorAll('[data-cnt]').forEach(el => {
    const path = el.dataset.cnt;
    const val  = getNested(CNT, path);
    if (val !== undefined) el.value = Array.isArray(val) ? val.join('\n') : val;
    el.addEventListener('input', () => markDirty());
    el.addEventListener('change', () => markDirty());
  });

  /* Content booleans */
  document.querySelectorAll('[data-cnt-bool]').forEach(el => {
    el.checked = !!getNested(CNT, el.dataset.cntBool);
    el.addEventListener('change', () => markDirty());
  });
}

function collectAll() {
  document.querySelectorAll('[data-cfg]').forEach(el => setNested(CFG, el.dataset.cfg, el.value));
  document.querySelectorAll('[data-cfg-bool]').forEach(el => setNested(CFG, el.dataset.cfgBool, el.checked));
  document.querySelectorAll('[data-cnt]').forEach(el => {
    const path = el.dataset.cnt;
    const arr  = el.dataset.cntArray;
    setNested(CNT, path, arr ? el.value.split('\n').map(s=>s.trim()).filter(Boolean) : el.value);
  });
  document.querySelectorAll('[data-cnt-bool]').forEach(el => setNested(CNT, el.dataset.cntBool, el.checked));

  /* TAC services */
  document.querySelectorAll('.tac-svc').forEach(el => setNested(CFG, 'cookies.services.' + el.dataset.svc, el.checked));

  /* Nav */
  CFG.nav.items = [];
  document.querySelectorAll('#navList .admin-list-item').forEach(item => {
    CFG.nav.items.push({ label: item.querySelector('.nl').value, href: item.querySelector('.nh').value });
  });

  /* Content repeaters */
  CNT.services.items    = collectRepeater('svcList',   i=>({ icon:q(i,'.ri-icon'),title:q(i,'.ri-title'),text:q(i,'.ri-text'),color:q(i,'.ri-color') }));
  CNT.portfolio.items   = collectRepeater('pfList',    i=>({ title:q(i,'.ri-title'),category:q(i,'.ri-cat'),images:Array.from({length:MAX_PF_IMAGES},(_,n)=>q(i,'.ri-img-'+n)).filter(Boolean),link:q(i,'.ri-link'),color:q(i,'.ri-color') }));
  CNT.process.steps     = collectRepeater('psList',    i=>({ number:q(i,'.ri-num'),title:q(i,'.ri-title'),text:q(i,'.ri-text') }));
  CNT.testimonials.items= collectRepeater('testiList', i=>({ quote:q(i,'.ri-quote'),author:q(i,'.ri-author'),role:q(i,'.ri-role'),company:q(i,'.ri-company') }));
}

function q(el, sel) { return el.querySelector(sel)?.value || ''; }
function collectRepeater(id, fn) {
  return Array.from(document.getElementById(id)?.querySelectorAll('.admin-repeater-item') || []).map(fn);
}

/* ============================================================
   COLOR FIELDS (generated)
============================================================ */
const COLOR_LABELS = { primary:'Couleur principale', secondary:'Couleur secondaire', accent:'Couleur d\'accent', light:'Couleur claire', text_dark:'Texte sombre', text_light:'Texte clair', bg_body:'Fond de page' };

(function buildColorFields() {
  const grid = document.getElementById('colorFields');
  if (!grid) return;
  Object.entries(COLOR_LABELS).forEach(([k, label]) => {
    const val = CFG.colors[k] || '#000000';
    const uid = 'cp-' + k;
    const div = document.createElement('div');
    div.className = 'admin-form-group';
    div.innerHTML = `<label class="admin-label">${label}</label>
      <div class="color-input-wrap">
        <input type="color" class="color-picker" id="picker-${k}" value="${val}">
        <input type="text"  class="admin-input color-text-input" id="${uid}" data-cfg="colors.${k}" value="${val}" maxlength="9" placeholder="#013336">
      </div>`;
    grid.appendChild(div);
    const picker = div.querySelector('.color-picker');
    const text   = div.querySelector('.color-text-input');
    picker.addEventListener('input', () => { text.value = picker.value; updateColorPreview(); markDirty(); });
    text.addEventListener('input', () => { if (/^#[0-9a-fA-F]{3,8}$/.test(text.value)) picker.value = text.value; updateColorPreview(); markDirty(); });
  });
  updateColorPreview();
})();

function updateColorPreview() {
  const bar = document.getElementById('colorPreviewBar');
  if (!bar) return;
  bar.innerHTML = ['primary','secondary','accent','light'].map(k => {
    const v = document.getElementById('cp-' + k)?.value || CFG.colors[k];
    return `<div style="background:${v}" title="${COLOR_LABELS[k]}"></div>`;
  }).join('');
}

/* ============================================================
   FONT PREVIEW
============================================================ */
function updateFontPreview() {
  const h = document.getElementById('fontHeading')?.value || CFG.fonts.heading;
  const b = document.getElementById('fontBody')?.value    || CFG.fonts.body;
  let link = document.getElementById('admin-font-link');
  if (!link) { link = document.createElement('link'); link.id = 'admin-font-link'; link.rel = 'stylesheet'; document.head.appendChild(link); }
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(h)}:wght@400;700;900&family=${encodeURIComponent(b)}:wght@400;500&display=swap`;
  const fh = document.getElementById('fpHeading'); if (fh) fh.style.fontFamily = `'${h}',serif`;
  const fb = document.getElementById('fpBody');    if (fb) fb.style.fontFamily = `'${b}',sans-serif`;
}
document.getElementById('fontHeading')?.addEventListener('input', updateFontPreview);
document.getElementById('fontBody')?.addEventListener('input', updateFontPreview);
updateFontPreview();

/* ============================================================
   TAC SERVICES
============================================================ */
const TAC_SERVICES = { googlefonts:'Google Fonts', googletagmanager:'Google Tag Manager', gtag:'GA4 (gtag)', analytics:'Universal Analytics', matomotm:'Matomo Tag Manager', matomo:'Matomo', facebook:'Facebook', facebookpost:'Facebook Post', twitter:'X / Twitter', twitterembed:'Twitter Embed', tiktok:'TikTok Pixel', tiktokvideo:'TikTok Vidéo' };
(function buildTacServices() {
  const grid = document.getElementById('tacServicesGrid');
  if (!grid) return;
  Object.entries(TAC_SERVICES).forEach(([k, label]) => {
    const div = document.createElement('div');
    div.className = 'admin-form-group';
    const checked = CFG.cookies.services?.[k] ? 'checked' : '';
    div.innerHTML = `<label class="admin-toggle-label"><input type="checkbox" class="admin-toggle tac-svc" data-svc="${k}" ${checked}><span>${label}</span></label>`;
    div.querySelector('.tac-svc').addEventListener('change', () => markDirty());
    grid.appendChild(div);
  });
})();

/* ============================================================
   NAV LIST
============================================================ */
function buildNavList() {
  const list = document.getElementById('navList');
  list.innerHTML = '';
  CFG.nav.items.forEach(item => addNavRow(item.label, item.href));
}
function addNavRow(label='', href='') {
  const list = document.getElementById('navList');
  const div  = document.createElement('div');
  div.className = 'admin-list-item';
  div.innerHTML = `<input type="text" class="admin-input nl" placeholder="Label" value="${label}"><input type="text" class="admin-input nh" placeholder="#section" value="${href}"><button class="admin-btn-icon" aria-label="Supprimer">×</button>`;
  div.querySelector('.admin-btn-icon').addEventListener('click', () => { div.remove(); markDirty(); });
  div.querySelectorAll('input').forEach(i => i.addEventListener('input', () => markDirty()));
  list.appendChild(div);
}
document.getElementById('addNavItem')?.addEventListener('click', () => { addNavRow(); markDirty(); });
buildNavList();

/* ============================================================
   CONTENT SUB-TABS (generated)
============================================================ */
const CONTENT_SECTIONS = [
  { id:'hero',         label:'Héro' },
  { id:'about',        label:'À propos' },
  { id:'services',     label:'Services' },
  { id:'portfolio',    label:'Portfolio' },
  { id:'process',      label:'Processus' },
  { id:'testimonials', label:'Témoignages' },
  { id:'contact',      label:'Contact' },
  { id:'footer',       label:'Footer' },
];

function bgLinkControls(sec) {
  const d = CNT[sec];
  return `<div class="section-block-controls">
    <div class="admin-form-group"><label class="admin-label">Fond de section</label><div class="color-input-wrap">
      <input type="color" class="color-picker" value="${d.bg_color||'#ffffff'}" id="bg-picker-${sec}">
      <input type="text"  class="admin-input" id="bg-text-${sec}" data-cnt="${sec}.bg_color" value="${d.bg_color||'#ffffff'}">
    </div></div>
    <div class="admin-form-group"><label class="admin-toggle-label"><input type="checkbox" class="admin-toggle" data-cnt-bool="${sec}.show_link_button" ${d.show_link_button?'checked':''}><span>Bouton lien</span></label></div>
    <div class="admin-form-group" style="flex:1;min-width:180px"><label class="admin-label">Texte bouton</label><input type="text" class="admin-input" data-cnt="${sec}.link_button_text" value="${d.link_button_text||''}"></div>
    <div class="admin-form-group" style="flex:1;min-width:180px"><label class="admin-label">URL bouton</label><input type="url" class="admin-input" data-cnt="${sec}.link_button_url" value="${d.link_button_url||''}"></div>
  </div>`;
}

function repeaterItem(title, fields) {
  return `<div class="admin-repeater-item">
    <div class="repeater-header"><span>${title}</span><button class="admin-btn-icon" aria-label="Supprimer">×</button></div>
    <div class="admin-grid-2" style="padding:1rem">${fields}</div>
  </div>`;
}

function pfImageFields(images) {
  const arr = (images || []).slice(0, MAX_PF_IMAGES);
  while (arr.length < MAX_PF_IMAGES) arr.push('');
  return `<div class="pf-image-fields">${arr.map((url, i) => `
    <input type="text" class="admin-input ri-img-${i}" placeholder="Image ${i + 1}${i === 0 ? ' (couverture)' : ''}" value="${url}">`).join('')}</div>`;
}

function buildContentSection(sec) {
  const d  = CNT[sec];
  const bg = bgLinkControls(sec);

  if (sec === 'hero') return bg + `<div class="admin-grid-2">
    <div class="admin-form-group"><label class="admin-label">Étiquette</label><input type="text" class="admin-input" data-cnt="hero.eyebrow" value="${d.eyebrow}"></div>
    <div class="admin-form-group"><label class="admin-label">Titre (H1)</label><input type="text" class="admin-input" data-cnt="hero.title" value="${d.title}"></div>
    <div class="admin-form-group admin-col-2"><label class="admin-label">Sous-titre</label><textarea class="admin-input admin-textarea" data-cnt="hero.subtitle" rows="3">${d.subtitle}</textarea></div>
    <div class="admin-form-group"><label class="admin-label">CTA principal — Texte</label><input type="text" class="admin-input" data-cnt="hero.cta_primary_text" value="${d.cta_primary_text}"></div>
    <div class="admin-form-group"><label class="admin-label">CTA principal — Lien</label><input type="text" class="admin-input" data-cnt="hero.cta_primary_link" value="${d.cta_primary_link}"></div>
    <div class="admin-form-group"><label class="admin-label">CTA secondaire — Texte</label><input type="text" class="admin-input" data-cnt="hero.cta_secondary_text" value="${d.cta_secondary_text}"></div>
    <div class="admin-form-group"><label class="admin-label">CTA secondaire — Lien</label><input type="text" class="admin-input" data-cnt="hero.cta_secondary_link" value="${d.cta_secondary_link}"></div>
    <div class="admin-form-group"><label class="admin-label">Image héro (URL)</label><input type="text" class="admin-input" data-cnt="hero.image" value="${d.image}"></div>
  </div>`;

  if (sec === 'about') return bg + `<div class="admin-grid-2">
    <div class="admin-form-group"><label class="admin-label">Étiquette</label><input type="text" class="admin-input" data-cnt="about.eyebrow" value="${d.eyebrow}"></div>
    <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input" data-cnt="about.title" value="${d.title}"></div>
    <div class="admin-form-group admin-col-2"><label class="admin-label">Texte</label><textarea class="admin-input admin-textarea" data-cnt="about.text" rows="5">${d.text}</textarea></div>
    <div class="admin-form-group admin-col-2"><label class="admin-label">Compétences (une par ligne)</label><textarea class="admin-input admin-textarea" data-cnt="about.skills" data-cnt-array="1" rows="5">${(d.skills||[]).join('\n')}</textarea></div>
    <div class="admin-form-group"><label class="admin-label">Image (URL)</label><input type="text" class="admin-input" data-cnt="about.image" value="${d.image}"></div>
  </div>`;

  if (sec === 'services') return bg + `<div class="admin-grid-2" style="margin-bottom:1rem">
    <div class="admin-form-group"><label class="admin-label">Étiquette</label><input type="text" class="admin-input" data-cnt="services.eyebrow" value="${d.eyebrow}"></div>
    <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input" data-cnt="services.title" value="${d.title}"></div>
    <div class="admin-form-group admin-col-2"><label class="admin-label">Sous-titre</label><input type="text" class="admin-input" data-cnt="services.subtitle" value="${d.subtitle||''}"></div>
  </div>
  <h3 class="admin-subsection-title">Cartes</h3>
  <div id="svcList" class="admin-repeater-list">${(d.items||[]).map(item=>`
    <div class="admin-repeater-item"><div class="repeater-header"><span>Service</span><button class="admin-btn-icon" aria-label="Supprimer">×</button></div><div class="admin-grid-2" style="padding:1rem">
      <div class="admin-form-group"><label class="admin-label">Icône (emoji)</label><input type="text" class="admin-input ri-icon" value="${item.icon}"></div>
      <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input ri-title" value="${item.title}"></div>
      <div class="admin-form-group admin-col-2"><label class="admin-label">Description</label><textarea class="admin-input admin-textarea ri-text" rows="2">${item.text}</textarea></div>
      <div class="admin-form-group"><label class="admin-label">Couleur</label><div class="color-input-wrap"><input type="color" class="color-picker" value="${item.color}"><input type="text" class="admin-input color-text-input ri-color" value="${item.color}"></div></div>
    </div></div>`).join('')}
  </div>
  <button class="admin-btn admin-btn-outline admin-btn-sm" onclick="addSvc()">+ Service</button>`;

  if (sec === 'portfolio') return bg + `<div class="admin-grid-2" style="margin-bottom:1rem">
    <div class="admin-form-group"><label class="admin-label">Étiquette</label><input type="text" class="admin-input" data-cnt="portfolio.eyebrow" value="${d.eyebrow}"></div>
    <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input" data-cnt="portfolio.title" value="${d.title}"></div>
    <div class="admin-form-group admin-col-2"><label class="admin-label">Sous-titre</label><input type="text" class="admin-input" data-cnt="portfolio.subtitle" value="${d.subtitle||''}"></div>
  </div>
  <h3 class="admin-subsection-title">Projets</h3>
  <div id="pfList" class="admin-repeater-list">${(d.items||[]).map(item=>`
    <div class="admin-repeater-item"><div class="repeater-header"><span>Projet</span><button class="admin-btn-icon" aria-label="Supprimer">×</button></div><div class="admin-grid-2" style="padding:1rem">
      <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input ri-title" value="${item.title}"></div>
      <div class="admin-form-group"><label class="admin-label">Catégorie</label><input type="text" class="admin-input ri-cat" value="${item.category}"></div>
      <div class="admin-form-group admin-col-2"><label class="admin-label">Images du projet (jusqu'à 6 URLs — la 1ère sert de couverture)</label>${pfImageFields(item.images)}</div>
      <div class="admin-form-group"><label class="admin-label">Lien (optionnel)</label><input type="url" class="admin-input ri-link" value="${item.link}"></div>
      <div class="admin-form-group"><label class="admin-label">Couleur de fond</label><div class="color-input-wrap"><input type="color" class="color-picker" value="${item.color}"><input type="text" class="admin-input color-text-input ri-color" value="${item.color}"></div></div>
    </div></div>`).join('')}
  </div>
  <button class="admin-btn admin-btn-outline admin-btn-sm" onclick="addPf()">+ Projet</button>`;

  if (sec === 'process') return bg + `<div class="admin-grid-2" style="margin-bottom:1rem">
    <div class="admin-form-group"><label class="admin-label">Étiquette</label><input type="text" class="admin-input" data-cnt="process.eyebrow" value="${d.eyebrow}"></div>
    <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input" data-cnt="process.title" value="${d.title}"></div>
  </div>
  <h3 class="admin-subsection-title">Étapes</h3>
  <div id="psList" class="admin-repeater-list">${(d.steps||[]).map(s=>`
    <div class="admin-repeater-item"><div class="repeater-header"><span>Étape</span><button class="admin-btn-icon" aria-label="Supprimer">×</button></div><div class="admin-grid-2" style="padding:1rem">
      <div class="admin-form-group"><label class="admin-label">Numéro</label><input type="text" class="admin-input ri-num" value="${s.number}"></div>
      <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input ri-title" value="${s.title}"></div>
      <div class="admin-form-group admin-col-2"><label class="admin-label">Description</label><textarea class="admin-input admin-textarea ri-text" rows="2">${s.text}</textarea></div>
    </div></div>`).join('')}
  </div>
  <button class="admin-btn admin-btn-outline admin-btn-sm" onclick="addPs()">+ Étape</button>`;

  if (sec === 'testimonials') return bg + `<div class="admin-grid-2" style="margin-bottom:1rem">
    <div class="admin-form-group"><label class="admin-label">Étiquette</label><input type="text" class="admin-input" data-cnt="testimonials.eyebrow" value="${d.eyebrow}"></div>
    <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input" data-cnt="testimonials.title" value="${d.title}"></div>
  </div>
  <h3 class="admin-subsection-title">Témoignages</h3>
  <div id="testiList" class="admin-repeater-list">${(d.items||[]).map(t=>`
    <div class="admin-repeater-item"><div class="repeater-header"><span>Témoignage</span><button class="admin-btn-icon" aria-label="Supprimer">×</button></div><div class="admin-grid-2" style="padding:1rem">
      <div class="admin-form-group admin-col-2"><label class="admin-label">Citation</label><textarea class="admin-input admin-textarea ri-quote" rows="3">${t.quote}</textarea></div>
      <div class="admin-form-group"><label class="admin-label">Auteur</label><input type="text" class="admin-input ri-author" value="${t.author}"></div>
      <div class="admin-form-group"><label class="admin-label">Rôle</label><input type="text" class="admin-input ri-role" value="${t.role}"></div>
      <div class="admin-form-group"><label class="admin-label">Entreprise</label><input type="text" class="admin-input ri-company" value="${t.company}"></div>
    </div></div>`).join('')}
  </div>
  <button class="admin-btn admin-btn-outline admin-btn-sm" onclick="addTesti()">+ Témoignage</button>`;

  if (sec === 'contact') return bg + `<div class="admin-grid-2">
    <div class="admin-form-group"><label class="admin-label">Étiquette</label><input type="text" class="admin-input" data-cnt="contact.eyebrow" value="${d.eyebrow}"></div>
    <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input" data-cnt="contact.title" value="${d.title}"></div>
    <div class="admin-form-group admin-col-2"><label class="admin-label">Sous-titre</label><textarea class="admin-input admin-textarea" data-cnt="contact.subtitle" rows="2">${d.subtitle}</textarea></div>
    <div class="admin-form-group"><label class="admin-label">Email</label><input type="email" class="admin-input" data-cnt="contact.email" value="${d.email}"></div>
    <div class="admin-form-group"><label class="admin-label">Téléphone</label><input type="tel" class="admin-input" data-cnt="contact.phone" value="${d.phone||''}"></div>
  </div>`;

  if (sec === 'footer') return bg + `<div class="admin-form-group"><label class="admin-label">Texte de copyright</label><input type="text" class="admin-input" data-cnt="footer.text" value="${d.text}"></div>`;

  return bg;
}

/* Build content tabs */
(function buildContentTabs() {
  const tabsEl   = document.getElementById('contentSubTabs');
  const panelsEl = document.getElementById('contentSubPanels');
  CONTENT_SECTIONS.forEach((sec, i) => {
    const btn = document.createElement('button');
    btn.className = 'sub-tab-btn' + (i === 0 ? ' active' : '');
    btn.textContent = sec.label;
    btn.dataset.subtab = sec.id;
    tabsEl.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'sub-tab-content' + (i === 0 ? ' active' : '');
    panel.id = 'sc-' + sec.id;
    panel.innerHTML = `<div class="admin-section"><h2 class="admin-section-title">Section ${sec.label}</h2>${buildContentSection(sec.id)}</div>`;
    panelsEl.appendChild(panel);
  });

  /* Sub-tab switching */
  tabsEl.querySelectorAll('.sub-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsEl.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
      panelsEl.querySelectorAll('.sub-tab-content').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('sc-' + btn.dataset.subtab)?.classList.add('active');
    });
  });
})();

/* Setup all color pickers in content panels */
function setupColorPickers(root) {
  root.querySelectorAll('.color-picker').forEach(picker => {
    const next = picker.nextElementSibling;
    if (!next || !next.classList.contains('color-text-input')) return;
    picker.addEventListener('input', () => { next.value = picker.value; markDirty(); });
    next.addEventListener('input', () => { if (/^#[0-9a-fA-F]{3,8}$/.test(next.value)) picker.value = next.value; markDirty(); });
  });
}
/* Bind section bg pickers */
CONTENT_SECTIONS.forEach(sec => {
  document.addEventListener('DOMContentLoaded', () => {}, false);
});
setupColorPickers(document.getElementById('contentSubPanels') || document.body);
setupColorPickers(document.getElementById('tab-general') || document.body);

/* Repeater remove delegation */
document.addEventListener('click', e => {
  if (e.target.closest('.admin-btn-icon') && e.target.closest('.admin-repeater-item')) {
    e.target.closest('.admin-repeater-item').remove(); markDirty();
  }
  if (e.target.closest('.admin-btn-icon') && e.target.closest('.admin-list-item')) {
    e.target.closest('.admin-list-item').remove(); markDirty();
  }
});

/* Repeater field edits (title/category/images/link/color/steps/quotes…) don't carry
   data-cnt/data-cfg bindings — mark dirty on any input/change inside a repeater or
   list item so Sauvegarder actually persists them. */
document.addEventListener('input', e => {
  if (e.target.closest('.admin-repeater-item, .admin-list-item')) markDirty();
});
document.addEventListener('change', e => {
  if (e.target.closest('.admin-repeater-item, .admin-list-item')) markDirty();
});

/* Add repeater helpers */
window.addSvc = () => {
  const l = document.getElementById('svcList'); if (!l) return;
  const d = document.createElement('div'); d.className = 'admin-repeater-item';
  d.innerHTML = `<div class="repeater-header"><span>Service</span><button class="admin-btn-icon" aria-label="Supprimer">×</button></div><div class="admin-grid-2" style="padding:1rem"><div class="admin-form-group"><label class="admin-label">Icône</label><input type="text" class="admin-input ri-icon" placeholder="🎨"></div><div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input ri-title"></div><div class="admin-form-group admin-col-2"><label class="admin-label">Description</label><textarea class="admin-input admin-textarea ri-text" rows="2"></textarea></div><div class="admin-form-group"><label class="admin-label">Couleur</label><div class="color-input-wrap"><input type="color" class="color-picker" value="#56b578"><input type="text" class="admin-input color-text-input ri-color" value="#56b578"></div></div></div>`;
  l.appendChild(d); setupColorPickers(d); markDirty();
};
window.addPf = () => {
  const l = document.getElementById('pfList'); if (!l) return;
  const d = document.createElement('div'); d.className = 'admin-repeater-item';
  d.innerHTML = `<div class="repeater-header"><span>Projet</span><button class="admin-btn-icon" aria-label="Supprimer">×</button></div><div class="admin-grid-2" style="padding:1rem"><div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input ri-title"></div><div class="admin-form-group"><label class="admin-label">Catégorie</label><input type="text" class="admin-input ri-cat"></div><div class="admin-form-group admin-col-2"><label class="admin-label">Images du projet (jusqu'à 6 URLs — la 1ère sert de couverture)</label>${pfImageFields([])}</div><div class="admin-form-group"><label class="admin-label">Lien</label><input type="url" class="admin-input ri-link"></div><div class="admin-form-group"><label class="admin-label">Couleur</label><div class="color-input-wrap"><input type="color" class="color-picker" value="#013336"><input type="text" class="admin-input color-text-input ri-color" value="#013336"></div></div></div>`;
  l.appendChild(d); setupColorPickers(d); markDirty();
};
window.addPs = () => {
  const l = document.getElementById('psList'); if (!l) return;
  const idx = l.children.length + 1;
  const d = document.createElement('div'); d.className = 'admin-repeater-item';
  d.innerHTML = `<div class="repeater-header"><span>Étape</span><button class="admin-btn-icon" aria-label="Supprimer">×</button></div><div class="admin-grid-2" style="padding:1rem"><div class="admin-form-group"><label class="admin-label">Numéro</label><input type="text" class="admin-input ri-num" value="0${idx}"></div><div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input ri-title"></div><div class="admin-form-group admin-col-2"><label class="admin-label">Description</label><textarea class="admin-input admin-textarea ri-text" rows="2"></textarea></div></div>`;
  l.appendChild(d); markDirty();
};
window.addTesti = () => {
  const l = document.getElementById('testiList'); if (!l) return;
  const d = document.createElement('div'); d.className = 'admin-repeater-item';
  d.innerHTML = `<div class="repeater-header"><span>Témoignage</span><button class="admin-btn-icon" aria-label="Supprimer">×</button></div><div class="admin-grid-2" style="padding:1rem"><div class="admin-form-group admin-col-2"><label class="admin-label">Citation</label><textarea class="admin-input admin-textarea ri-quote" rows="3"></textarea></div><div class="admin-form-group"><label class="admin-label">Auteur</label><input type="text" class="admin-input ri-author"></div><div class="admin-form-group"><label class="admin-label">Rôle</label><input type="text" class="admin-input ri-role"></div><div class="admin-form-group"><label class="admin-label">Entreprise</label><input type="text" class="admin-input ri-company"></div></div>`;
  l.appendChild(d); markDirty();
};

/* ============================================================
   BIND FIELDS (after DOM built)
============================================================ */
bindFields();

/* ============================================================
   EXPORT / IMPORT / RESET
============================================================ */
document.getElementById('exportBtn')?.addEventListener('click', () => {
  collectAll();
  const data = { config: CFG, content: CNT, exported: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a    = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vp-backup-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
});

document.getElementById('importFile')?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.config)  { localStorage.setItem('vp_config',  JSON.stringify(data.config)); }
      if (data.content) { localStorage.setItem('vp_content', JSON.stringify(data.content)); }
      location.reload();
    } catch { alert('Fichier JSON invalide.'); }
  };
  reader.readAsText(file);
});

document.getElementById('resetBtn')?.addEventListener('click', () => {
  if (!confirm('Réinitialiser toutes les données ? Cette action est irréversible.')) return;
  localStorage.removeItem('vp_config');
  localStorage.removeItem('vp_content');
  location.reload();
});

/* ============================================================
   PASSWORD CHANGE
============================================================ */
async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

document.getElementById('changePwdBtn')?.addEventListener('click', async () => {
  const cur  = document.getElementById('curPwd').value;
  const nw   = document.getElementById('newPwd').value;
  const conf = document.getElementById('confPwd').value;
  const msgEl = document.getElementById('pwdMsg');

  const stored    = JSON.parse(localStorage.getItem('vp_auth') || '{}');
  const curHash   = await sha256(cur);
  const validCur  = curHash === stored.hash;

  if (!validCur) { showPwdMsg('error', 'Mot de passe actuel incorrect.'); return; }
  if (nw.length < 8) { showPwdMsg('error', 'Minimum 8 caractères.'); return; }
  if (nw !== conf) { showPwdMsg('error', 'Les mots de passe ne correspondent pas.'); return; }

  const newHash = await sha256(nw);
  localStorage.setItem('vp_auth', JSON.stringify({ username: stored.username || 'admin', hash: newHash }));
  showPwdMsg('success', '✓ Mot de passe mis à jour.');
  document.getElementById('curPwd').value = '';
  document.getElementById('newPwd').value = '';
  document.getElementById('confPwd').value = '';
});

function showPwdMsg(type, msg) {
  const el = document.getElementById('pwdMsg');
  el.textContent = msg;
  el.className = 'admin-alert admin-alert-' + type;
  el.hidden = false;
}

/* ============================================================
   LOGOUT
============================================================ */
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  if (DIRTY && !confirm('Modifications non sauvegardées. Quitter ?')) return;
  sessionStorage.removeItem('vp_admin_session');
  location.href = 'index.html';
});
