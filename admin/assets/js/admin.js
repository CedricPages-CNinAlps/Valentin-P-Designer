'use strict';

/* =============================================
   BACK OFFICE — Admin JavaScript
============================================= */

const DATA    = window.ADMIN_DATA || { config: {}, content: {} };
let   DIRTY   = false;
let   saveTimer;

/* =============================================
   SIDEBAR
============================================= */
const sidebar      = document.getElementById('adminSidebar');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarToggle= document.getElementById('sidebarToggle');

sidebarToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));
sidebarClose?.addEventListener('click',  () => sidebar.classList.remove('open'));
document.addEventListener('click', e => {
  if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== sidebarToggle) {
    sidebar.classList.remove('open');
  }
});

/* =============================================
   TABS
============================================= */
const tabLinks   = document.querySelectorAll('.sidebar-link[data-tab]');
const tabs       = document.querySelectorAll('.admin-tab');
const pageTitle  = document.getElementById('pageTitle');
const tabTitles  = { general: 'Général', appearance: 'Apparence', content: 'Contenu', media: 'Médias', seo: 'SEO', contact: 'EmailJS', tracking: 'Tracking', cookies: 'Cookies', security: 'Sécurité' };

tabLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.dataset.tab;
    tabLinks.forEach(l => l.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    link.classList.add('active');
    document.getElementById('tab-' + target)?.classList.add('active');
    pageTitle.textContent = tabTitles[target] || target;
    if (target === 'media') loadMedia();
    sidebar.classList.remove('open');
  });
});

/* =============================================
   SUB-TABS (Content sections)
============================================= */
document.querySelectorAll('.sub-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent  = btn.closest('.admin-tab');
    const target  = btn.dataset.subtab;
    parent.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    parent.querySelectorAll('.sub-tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(target)?.classList.add('active');
  });
});

/* =============================================
   COLOR PICKERS — sync with text inputs
============================================= */
document.querySelectorAll('.color-picker').forEach(picker => {
  const targetId = picker.dataset.target;
  const target   = document.getElementById(targetId);
  if (!target) return;

  picker.addEventListener('input', () => {
    target.value = picker.value;
    updateColorPreview();
    markDirty();
  });
  target.addEventListener('input', () => {
    if (/^#[0-9a-fA-F]{3,8}$/.test(target.value)) {
      picker.value = target.value;
      updateColorPreview();
    }
    markDirty();
  });
});

function updateColorPreview() {
  const bar = document.getElementById('colorPreviewBar');
  if (!bar) return;
  const divs = bar.querySelectorAll('div');
  const keys  = ['primary', 'secondary', 'accent', 'light'];
  keys.forEach((k, i) => {
    const input = document.querySelector(`[data-config="colors.${k}"]`);
    if (input && divs[i]) divs[i].style.background = input.value;
  });
}

/* =============================================
   DATA BINDING — config & content fields
============================================= */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!cur[keys[i]]) cur[keys[i]] = {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

function markDirty() {
  DIRTY = true;
  clearTimeout(saveTimer);
  setSaveStatus('saving', 'Modifications en cours...');
  saveTimer = setTimeout(autoSave, 2500);
}

function setSaveStatus(type, msg) {
  const el = document.getElementById('saveStatus');
  el.textContent = msg;
  el.className = 'save-status ' + type;
}

/* Config fields */
document.querySelectorAll('[data-config]').forEach(el => {
  el.addEventListener('change', () => markDirty());
  el.addEventListener('input',  () => markDirty());
});

/* Config bool (checkboxes) */
document.querySelectorAll('[data-config-bool]').forEach(el => {
  el.addEventListener('change', () => markDirty());
});

/* Content fields */
document.querySelectorAll('[data-content]').forEach(el => {
  el.addEventListener('input',  () => markDirty());
  el.addEventListener('change', () => markDirty());
});

/* Content array (newline-separated) */
document.querySelectorAll('[data-content-array]').forEach(el => {
  el.addEventListener('input', () => markDirty());
});

/* Content bool checkboxes */
document.querySelectorAll('[data-content-bool]').forEach(el => {
  el.addEventListener('change', () => markDirty());
});

/* TAC service toggles */
document.querySelectorAll('.tac-service-toggle').forEach(el => {
  el.addEventListener('change', () => markDirty());
});

/* =============================================
   COLLECT DATA FOR SAVE
============================================= */
function collectConfig() {
  const cfg = JSON.parse(JSON.stringify(DATA.config));

  document.querySelectorAll('[data-config]').forEach(el => {
    setNestedValue(cfg, el.dataset.config, el.tagName === 'SELECT' ? el.value : el.value);
  });

  document.querySelectorAll('[data-config-bool]').forEach(el => {
    setNestedValue(cfg, el.dataset.configBool, el.checked);
  });

  /* TAC services */
  document.querySelectorAll('.tac-service-toggle').forEach(el => {
    setNestedValue(cfg, 'cookies.services.' + el.dataset.service, el.checked);
  });

  /* Nav items */
  const navItems = [];
  document.querySelectorAll('#navItemsList .admin-list-item').forEach(item => {
    navItems.push({
      label: item.querySelector('.nav-label')?.value || '',
      href:  item.querySelector('.nav-href')?.value || '',
    });
  });
  cfg.nav = cfg.nav || {};
  cfg.nav.items = navItems;

  return cfg;
}

function collectContent() {
  const cnt = JSON.parse(JSON.stringify(DATA.content));

  /* Simple content fields */
  document.querySelectorAll('[data-content]').forEach(el => {
    setNestedValue(cnt, el.dataset.content, el.value);
  });

  /* Content arrays */
  document.querySelectorAll('[data-content-array]').forEach(el => {
    const path = el.dataset.contentArray;
    const arr  = el.value.split('\n').map(s => s.trim()).filter(Boolean);
    setNestedValue(cnt, path, arr);
  });

  /* Content booleans */
  document.querySelectorAll('[data-content-bool]').forEach(el => {
    const path = el.dataset.contentBool;
    setNestedValue(cnt, path, el.checked);
  });

  /* Services repeater */
  cnt.services.items = collectRepeater('servicesItems', item => ({
    icon:  item.querySelector('.service-icon')?.value || '',
    title: item.querySelector('.service-title')?.value || '',
    text:  item.querySelector('.service-text')?.value || '',
    color: item.querySelector('.service-color')?.value || '#56b578',
  }));

  /* Portfolio repeater */
  cnt.portfolio.items = collectRepeater('portfolioItems', item => ({
    title:    item.querySelector('.pf-title')?.value || '',
    category: item.querySelector('.pf-category')?.value || '',
    image:    item.querySelector('.pf-image')?.value || '',
    link:     item.querySelector('.pf-link')?.value || '',
    color:    item.querySelector('.pf-color')?.value || '#013336',
  }));

  /* Process steps */
  cnt.process.steps = collectRepeater('processSteps', item => ({
    number: item.querySelector('.ps-number')?.value || '',
    title:  item.querySelector('.ps-title')?.value || '',
    text:   item.querySelector('.ps-text')?.value || '',
  }));

  /* Testimonials */
  cnt.testimonials.items = collectRepeater('testimonialItems', item => ({
    quote:   item.querySelector('.testi-quote')?.value || '',
    author:  item.querySelector('.testi-author')?.value || '',
    role:    item.querySelector('.testi-role')?.value || '',
    company: item.querySelector('.testi-company')?.value || '',
  }));

  return cnt;
}

function collectRepeater(containerId, extractor) {
  const container = document.getElementById(containerId);
  if (!container) return [];
  return Array.from(container.querySelectorAll('.admin-repeater-item')).map(extractor);
}

/* =============================================
   SAVE
============================================= */
async function autoSave() {
  if (!DIRTY) return;
  await saveAll();
}

async function saveAll() {
  setSaveStatus('saving', 'Sauvegarde...');
  try {
    const [cfgRes, cntRes] = await Promise.all([
      fetch('api/save-config.php',  { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(collectConfig()) }),
      fetch('api/save-content.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(collectContent()) }),
    ]);

    const [cfgData, cntData] = await Promise.all([cfgRes.json(), cntRes.json()]);

    if (cfgData.error || cntData.error) {
      setSaveStatus('error', 'Erreur : ' + (cfgData.error || cntData.error));
    } else {
      DIRTY = false;
      setSaveStatus('saved', '✓ Sauvegardé');
      setTimeout(() => { if (!DIRTY) setSaveStatus('', ''); }, 3000);
    }
  } catch (err) {
    setSaveStatus('error', 'Erreur réseau');
    console.error(err);
  }
}

document.getElementById('globalSaveBtn')?.addEventListener('click', saveAll);

/* Warn on leave */
window.addEventListener('beforeunload', e => {
  if (DIRTY) { e.preventDefault(); e.returnValue = ''; }
});

/* =============================================
   LOGOUT
============================================= */
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  if (DIRTY && !confirm('Vous avez des modifications non sauvegardées. Quitter quand même ?')) return;
  await fetch('api/auth.php?action=logout', { method: 'GET' });
  location.href = 'index.php';
});

/* =============================================
   REPEATERS — Add / Remove
============================================= */
function addRepeaterItem(containerId, templateHtml) {
  const container = document.getElementById(containerId);
  const div = document.createElement('div');
  div.className = 'admin-repeater-item';
  div.innerHTML = templateHtml;
  container.appendChild(div);
  setupRepeaterRemove(div);
  setupColorPickers(div);
  markDirty();
}

function setupRepeaterRemove(container) {
  container.querySelectorAll('.repeater-remove').forEach(btn => {
    btn.addEventListener('click', () => { btn.closest('.admin-repeater-item').remove(); markDirty(); });
  });
}
document.querySelectorAll('.admin-repeater-item').forEach(setupRepeaterRemove);

function setupColorPickers(root) {
  root.querySelectorAll('.color-picker').forEach(picker => {
    const uid = 'cp-' + Math.random().toString(36).slice(2);
    const textInput = picker.nextElementSibling;
    if (textInput && textInput.classList.contains('color-text-input')) {
      textInput.id = uid;
      picker.dataset.target = uid;
      picker.addEventListener('input', () => { textInput.value = picker.value; markDirty(); });
      textInput.addEventListener('input', () => {
        if (/^#[0-9a-fA-F]{3,8}$/.test(textInput.value)) picker.value = textInput.value;
        markDirty();
      });
    }
  });
}

/* Service */
document.getElementById('addService')?.addEventListener('click', () => {
  const idx = document.querySelectorAll('#servicesItems .admin-repeater-item').length;
  addRepeaterItem('servicesItems', `
    <div class="repeater-header"><span>Service ${idx + 1}</span><button class="admin-btn-icon admin-btn-danger repeater-remove" aria-label="Supprimer">×</button></div>
    <div class="admin-grid-2">
      <div class="admin-form-group"><label class="admin-label">Icône</label><input type="text" class="admin-input service-icon" placeholder="🎨"></div>
      <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input service-title"></div>
      <div class="admin-form-group admin-col-2"><label class="admin-label">Description</label><textarea class="admin-input admin-textarea service-text" rows="2"></textarea></div>
      <div class="admin-form-group"><label class="admin-label">Couleur</label><div class="color-input-wrap"><input type="color" class="color-picker" value="#56b578"><input type="text" class="admin-input color-text-input service-color" value="#56b578"></div></div>
    </div>`);
});

/* Portfolio */
document.getElementById('addPortfolioItem')?.addEventListener('click', () => {
  const idx = document.querySelectorAll('#portfolioItems .admin-repeater-item').length;
  addRepeaterItem('portfolioItems', `
    <div class="repeater-header"><span>Projet ${idx + 1}</span><button class="admin-btn-icon admin-btn-danger repeater-remove" aria-label="Supprimer">×</button></div>
    <div class="admin-grid-2">
      <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input pf-title"></div>
      <div class="admin-form-group"><label class="admin-label">Catégorie</label><input type="text" class="admin-input pf-category"></div>
      <div class="admin-form-group"><label class="admin-label">Image</label><input type="text" class="admin-input pf-image"></div>
      <div class="admin-form-group"><label class="admin-label">Lien</label><input type="url" class="admin-input pf-link"></div>
      <div class="admin-form-group"><label class="admin-label">Couleur</label><div class="color-input-wrap"><input type="color" class="color-picker" value="#013336"><input type="text" class="admin-input color-text-input pf-color" value="#013336"></div></div>
    </div>`);
});

/* Process */
document.getElementById('addProcessStep')?.addEventListener('click', () => {
  const idx = document.querySelectorAll('#processSteps .admin-repeater-item').length;
  const num  = String(idx + 1).padStart(2, '0');
  addRepeaterItem('processSteps', `
    <div class="repeater-header"><span>Étape ${idx + 1}</span><button class="admin-btn-icon admin-btn-danger repeater-remove" aria-label="Supprimer">×</button></div>
    <div class="admin-grid-2">
      <div class="admin-form-group"><label class="admin-label">Numéro</label><input type="text" class="admin-input ps-number" value="${num}"></div>
      <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input ps-title"></div>
      <div class="admin-form-group admin-col-2"><label class="admin-label">Description</label><textarea class="admin-input admin-textarea ps-text" rows="2"></textarea></div>
    </div>`);
});

/* Testimonials */
document.getElementById('addTestimonial')?.addEventListener('click', () => {
  const idx = document.querySelectorAll('#testimonialItems .admin-repeater-item').length;
  addRepeaterItem('testimonialItems', `
    <div class="repeater-header"><span>Témoignage ${idx + 1}</span><button class="admin-btn-icon admin-btn-danger repeater-remove" aria-label="Supprimer">×</button></div>
    <div class="admin-grid-2">
      <div class="admin-form-group admin-col-2"><label class="admin-label">Citation</label><textarea class="admin-input admin-textarea testi-quote" rows="3"></textarea></div>
      <div class="admin-form-group"><label class="admin-label">Auteur</label><input type="text" class="admin-input testi-author"></div>
      <div class="admin-form-group"><label class="admin-label">Rôle</label><input type="text" class="admin-input testi-role"></div>
      <div class="admin-form-group"><label class="admin-label">Entreprise</label><input type="text" class="admin-input testi-company"></div>
    </div>`);
});

/* Nav items */
document.getElementById('addNavItem')?.addEventListener('click', () => {
  const container = document.getElementById('navItemsList');
  const div = document.createElement('div');
  div.className = 'admin-list-item';
  div.innerHTML = `
    <input type="text" class="admin-input nav-label" placeholder="Label">
    <input type="text" class="admin-input nav-href" placeholder="#section">
    <button class="admin-btn-icon admin-btn-danger nav-item-remove" aria-label="Supprimer">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
    </button>`;
  div.querySelector('.nav-item-remove').addEventListener('click', () => { div.remove(); markDirty(); });
  div.querySelectorAll('.admin-input').forEach(i => i.addEventListener('input', () => markDirty()));
  container.appendChild(div);
  markDirty();
});

document.querySelectorAll('.nav-item-remove').forEach(btn => {
  btn.addEventListener('click', () => { btn.closest('.admin-list-item').remove(); markDirty(); });
});

/* =============================================
   MEDIA MANAGER
============================================= */
let currentMediaType = 'images';

document.querySelectorAll('.media-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.media-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMediaType = btn.dataset.mediaType;
    loadMedia();
  });
});

async function loadMedia(gridId = 'mediaGrid') {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '<p style="color:var(--admin-muted);font-size:.85rem;grid-column:1/-1">Chargement...</p>';
  try {
    const res  = await fetch(`api/upload.php?action=list&type=${currentMediaType}`);
    const data = await res.json();
    if (!data.success) { grid.innerHTML = '<p style="color:red">Erreur de chargement.</p>'; return; }
    renderMediaGrid(data.files, grid, gridId === 'modalMediaGrid');
  } catch (e) {
    grid.innerHTML = '<p style="color:red">Erreur réseau.</p>';
  }
}

function renderMediaGrid(files, grid, isModal = false) {
  if (!files || files.length === 0) {
    grid.innerHTML = '<p style="color:var(--admin-muted);font-size:.85rem;grid-column:1/-1;padding:1rem">Aucun fichier. Téléversez des médias ci-dessus.</p>';
    return;
  }
  grid.innerHTML = '';
  files.forEach(f => {
    const item = document.createElement('div');
    item.className = 'media-item';
    const isVideo = f.type?.startsWith('video/');
    const preview = isVideo
      ? `<video src="${f.url}" muted loop preload="metadata"></video>`
      : `<img src="${f.url}" alt="${f.name}" loading="lazy">`;
    const shortLink = f.shortUrl ? `<button type="button" class="media-item-shortlink" data-short-url="${f.shortUrl}" title="Copier le lien court">🔗 /${f.shortUrl}</button>` : '';

    item.innerHTML = `
      ${preview}
      ${shortLink}
      <div class="media-item-overlay">
        ${isModal ? `<button class="media-item-btn media-item-copy" data-url="${f.url}">Utiliser</button>` : `<button class="media-item-btn media-item-copy" data-short-url="${f.shortUrl}" title="Copier le lien court">Copier le lien</button>`}
        <button class="media-item-btn media-item-delete" data-name="${f.name}" title="Supprimer">Supprimer</button>
      </div>
      <span class="media-item-name">${f.name}</span>`;

    function copyShortLink(shortUrl) {
      const fullUrl = location.origin + '/' + shortUrl;
      navigator.clipboard?.writeText(fullUrl).then(() => {
        setSaveStatus('saved', '✓ Lien copié : ' + fullUrl);
        setTimeout(() => setSaveStatus('', ''), 2500);
      });
    }

    item.querySelector('.media-item-shortlink')?.addEventListener('click', (e) => {
      e.stopPropagation();
      copyShortLink(e.currentTarget.dataset.shortUrl);
    });

    item.querySelector('.media-item-copy').addEventListener('click', (e) => {
      e.stopPropagation();
      if (isModal) {
        applyMediaPick(e.currentTarget.dataset.url);
        closeModal();
      } else {
        copyShortLink(e.currentTarget.dataset.shortUrl);
      }
    });

    item.querySelector('.media-item-delete').addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm('Supprimer ce fichier définitivement ?')) return;
      const name = e.currentTarget.dataset.name;
      const fd = new FormData();
      fd.append('action', 'delete');
      fd.append('file', name);
      fd.append('type', currentMediaType);
      await fetch('api/upload.php', { method: 'POST', body: fd });
      loadMedia(grid.id);
    });

    grid.appendChild(item);
  });
}

/* Upload */
const uploadZone   = document.getElementById('mediaUploadZone');
const fileInput    = document.getElementById('fileUploadInput');
const progressList = document.getElementById('uploadProgressList');

uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone?.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  uploadFiles(e.dataTransfer.files);
});
fileInput?.addEventListener('change', () => uploadFiles(fileInput.files));

async function uploadFiles(fileList) {
  for (const file of fileList) {
    const item    = document.createElement('div');
    item.className = 'upload-progress-item';
    item.innerHTML = `<span>${file.name}</span><div class="upload-progress-bar-wrap"><div class="upload-progress-bar" style="width:0%"></div></div>`;
    progressList.appendChild(item);
    const bar = item.querySelector('.upload-progress-bar');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', currentMediaType);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'api/upload.php');
      xhr.upload.onprogress = e => { if (e.lengthComputable) bar.style.width = (e.loaded / e.total * 100) + '%'; };
      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        if (data.success) {
          bar.style.width = '100%';
          bar.style.background = 'var(--color-secondary)';
          setTimeout(() => { item.remove(); loadMedia(); }, 1200);
        } else {
          bar.style.background = 'var(--color-danger)';
          item.querySelector('span').textContent += ' — Erreur: ' + data.error;
        }
      };
      xhr.onerror = () => { bar.style.background = 'var(--color-danger)'; };
      xhr.send(fd);
    } catch (err) {
      item.remove();
    }
  }
  if (fileInput) fileInput.value = '';
}

/* =============================================
   MEDIA PICKER MODAL
============================================= */
const mediaModal    = document.getElementById('mediaPickerModal');
let   mediaPickTarget = null;
let   mediaPickContentTarget = null;

document.querySelectorAll('.open-media-picker').forEach(btn => {
  btn.addEventListener('click', () => {
    mediaPickTarget        = btn.dataset.target || null;
    mediaPickContentTarget = btn.dataset.targetContent || null;
    const type = btn.dataset.type || 'images';
    currentMediaType = type;
    mediaModal.hidden = false;
    loadMedia('modalMediaGrid');
  });
});

function applyMediaPick(url) {
  if (mediaPickTarget) {
    const input = document.querySelector(`[data-config="${mediaPickTarget}"]`);
    if (input) { input.value = url; markDirty(); }
  }
  if (mediaPickContentTarget) {
    const input = document.querySelector(`[data-content="${mediaPickContentTarget}"]`);
    if (input) { input.value = url; markDirty(); }
  }
}

function closeModal() { mediaModal.hidden = true; }
mediaModal?.querySelector('.admin-modal-close')?.addEventListener('click', closeModal);
mediaModal?.querySelector('.admin-modal-backdrop')?.addEventListener('click', closeModal);

/* =============================================
   PASSWORD CHANGE
============================================= */
document.querySelectorAll('.toggle-pwd').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.querySelector('.eye-show').hidden = show;
    btn.querySelector('.eye-hide').hidden = !show;
  });
});

document.getElementById('changePwdBtn')?.addEventListener('click', async () => {
  const current = document.getElementById('currentPwd').value;
  const newPwd  = document.getElementById('newPwd').value;
  const confirm = document.getElementById('confirmPwd').value;
  const msgEl   = document.getElementById('pwdMessage');

  if (!current || !newPwd || !confirm) {
    showPwdMsg('error', 'Veuillez remplir tous les champs.');
    return;
  }

  const fd = new FormData();
  fd.append('action', 'change_password');
  fd.append('current_password', current);
  fd.append('new_password', newPwd);
  fd.append('confirm_password', confirm);

  const res  = await fetch('api/auth.php', { method: 'POST', body: fd });
  const data = await res.json();

  if (data.success) {
    showPwdMsg('success', '✓ ' + data.message);
    document.getElementById('currentPwd').value = '';
    document.getElementById('newPwd').value     = '';
    document.getElementById('confirmPwd').value = '';
  } else {
    showPwdMsg('error', data.error);
  }
});

function showPwdMsg(type, msg) {
  const el = document.getElementById('pwdMessage');
  el.textContent = msg;
  el.className = 'admin-alert admin-alert-' + type;
  el.hidden = false;
}

/* =============================================
   FONT PREVIEW
============================================= */
function updateFontPreview() {
  const heading = document.getElementById('fontHeading')?.value;
  const body    = document.getElementById('fontBody')?.value;
  const preview = document.getElementById('fontPreview');
  if (!preview || !heading || !body) return;

  const link = document.querySelector('#dyn-font-link') || (() => {
    const l = document.createElement('link');
    l.id  = 'dyn-font-link';
    l.rel = 'stylesheet';
    document.head.appendChild(l);
    return l;
  })();
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(heading)}:wght@400;700;900&family=${encodeURIComponent(body)}:wght@400;500&display=swap`;

  const spans = preview.querySelectorAll('span');
  if (spans[0]) spans[0].style.fontFamily = `'${heading}', serif`;
  if (spans[1]) spans[1].style.fontFamily = `'${body}', sans-serif`;
}

document.getElementById('fontHeading')?.addEventListener('input', updateFontPreview);
document.getElementById('fontBody')?.addEventListener('input', updateFontPreview);
updateFontPreview();

/* =============================================
   INIT
============================================= */
updateColorPreview();
setSaveStatus('', '');
