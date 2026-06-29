<?php
session_start();
if (empty($_SESSION['admin_logged_in'])) {
    header('Location: index.php');
    exit;
}

$config  = json_decode(file_get_contents(dirname(__DIR__) . '/data/config.json'), true);
$content = json_decode(file_get_contents(dirname(__DIR__) . '/data/content.json'), true);
$colors  = $config['colors'];

function e($s) { return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8'); }
function j($v) { return json_encode($v, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE); }
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Back Office — <?= e($config['site']['name']) ?></title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="stylesheet" href="assets/css/admin.css">
  <style>
    :root {
      --color-primary:   <?= e($colors['primary']) ?>;
      --color-secondary: <?= e($colors['secondary']) ?>;
      --color-light:     <?= e($colors['light']) ?>;
      --color-accent:    <?= e($colors['accent']) ?>;
    }
  </style>
</head>
<body class="admin-body">

<!-- SIDEBAR -->
<aside class="admin-sidebar" id="adminSidebar">
  <div class="sidebar-header">
    <span class="admin-logo-text"><?= e($config['site']['logo_text'] ?: 'VP') ?></span>
    <span class="sidebar-title">Back Office</span>
    <button class="sidebar-close" id="sidebarClose" aria-label="Fermer le menu">×</button>
  </div>
  <nav class="sidebar-nav" aria-label="Navigation admin">
    <a href="#" class="sidebar-link active" data-tab="general">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
      Général
    </a>
    <a href="#" class="sidebar-link" data-tab="appearance">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
      Apparence
    </a>
    <a href="#" class="sidebar-link" data-tab="content">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      Contenu
    </a>
    <a href="#" class="sidebar-link" data-tab="media">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      Médias
    </a>
    <a href="#" class="sidebar-link" data-tab="seo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      SEO
    </a>
    <a href="#" class="sidebar-link" data-tab="contact">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      EmailJS
    </a>
    <a href="#" class="sidebar-link" data-tab="tracking">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      Tracking
    </a>
    <a href="#" class="sidebar-link" data-tab="cookies">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10c0-.55-.05-1.1-.14-1.63a3 3 0 0 1-3.23-3.23A3 3 0 0 1 15 4.14 10 10 0 0 0 12 2z"/></svg>
      Cookies
    </a>
    <a href="#" class="sidebar-link" data-tab="security">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      Sécurité
    </a>
    <hr class="sidebar-divider">
    <a href="../" target="_blank" class="sidebar-link">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      Voir le site
    </a>
    <button class="sidebar-link sidebar-logout" id="logoutBtn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Déconnexion
    </button>
  </nav>
</aside>

<!-- MAIN -->
<div class="admin-main">
  <!-- Top Bar -->
  <header class="admin-topbar">
    <button class="topbar-menu-toggle" id="sidebarToggle" aria-label="Ouvrir le menu">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
    <h1 class="topbar-title" id="pageTitle">Général</h1>
    <div class="topbar-actions">
      <span class="save-status" id="saveStatus" aria-live="polite"></span>
      <button class="admin-btn admin-btn-primary" id="globalSaveBtn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Sauvegarder
      </button>
    </div>
  </header>

  <!-- Tab Content -->
  <div class="admin-content">

    <!-- ===== GENERAL ===== -->
    <section class="admin-tab active" id="tab-general" aria-label="Paramètres généraux">
      <div class="admin-section">
        <h2 class="admin-section-title">Identité du site</h2>
        <div class="admin-grid-2">
          <div class="admin-form-group">
            <label class="admin-label">Nom du site / Designer</label>
            <input type="text" class="admin-input" data-config="site.name" value="<?= e($config['site']['name']) ?>" placeholder="Valentin Porlan">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Accroche</label>
            <input type="text" class="admin-input" data-config="site.tagline" value="<?= e($config['site']['tagline']) ?>" placeholder="Designer Graphique & Identité Visuelle">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Initiales / Logo texte</label>
            <input type="text" class="admin-input" data-config="site.logo_text" value="<?= e($config['site']['logo_text']) ?>" placeholder="VP" maxlength="4">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Langue</label>
            <select class="admin-input" data-config="site.language">
              <option value="fr" <?= $config['site']['language'] === 'fr' ? 'selected' : '' ?>>Français</option>
              <option value="en" <?= $config['site']['language'] === 'en' ? 'selected' : '' ?>>English</option>
              <option value="es" <?= $config['site']['language'] === 'es' ? 'selected' : '' ?>>Español</option>
            </select>
          </div>
          <div class="admin-form-group admin-col-2">
            <label class="admin-label">Description courte</label>
            <textarea class="admin-input admin-textarea" data-config="site.description" rows="3"><?= e($config['site']['description']) ?></textarea>
          </div>
          <div class="admin-form-group admin-col-2">
            <label class="admin-label">Mots-clés SEO</label>
            <input type="text" class="admin-input" data-config="site.keywords" value="<?= e($config['site']['keywords']) ?>" placeholder="design graphique, logo, branding...">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">URL du site</label>
            <input type="url" class="admin-input" data-config="site.url" value="<?= e($config['site']['url']) ?>" placeholder="https://votresite.fr">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Nom de l'auteur</label>
            <input type="text" class="admin-input" data-config="site.author" value="<?= e($config['site']['author']) ?>" placeholder="Valentin Porlan">
          </div>
        </div>
      </div>

      <div class="admin-section">
        <h2 class="admin-section-title">Réseaux sociaux</h2>
        <div class="admin-grid-2">
          <?php foreach (['instagram' => 'Instagram', 'behance' => 'Behance', 'linkedin' => 'LinkedIn', 'dribbble' => 'Dribbble', 'twitter' => 'X / Twitter'] as $k => $label): ?>
          <div class="admin-form-group">
            <label class="admin-label"><?= $label ?></label>
            <input type="url" class="admin-input" data-config="social.<?= $k ?>" value="<?= e($config['social'][$k]) ?>" placeholder="https://...">
          </div>
          <?php endforeach; ?>
        </div>
      </div>

      <div class="admin-section">
        <h2 class="admin-section-title">Navigation</h2>
        <p class="admin-hint">Modifiez les éléments du menu principal.</p>
        <div id="navItemsList" class="admin-list">
          <?php foreach ($config['nav']['items'] as $i => $item): ?>
          <div class="admin-list-item" data-index="<?= $i ?>">
            <input type="text" class="admin-input nav-label" placeholder="Label" value="<?= e($item['label']) ?>">
            <input type="text" class="admin-input nav-href" placeholder="#section" value="<?= e($item['href']) ?>">
            <button class="admin-btn-icon admin-btn-danger nav-item-remove" aria-label="Supprimer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
          <?php endforeach; ?>
        </div>
        <button class="admin-btn admin-btn-outline" id="addNavItem">+ Ajouter un lien</button>
      </div>
    </section>

    <!-- ===== APPEARANCE ===== -->
    <section class="admin-tab" id="tab-appearance" aria-label="Apparence">
      <div class="admin-section">
        <h2 class="admin-section-title">Palette de couleurs</h2>
        <div class="admin-grid-3">
          <?php
          $colorLabels = [
            'primary'    => 'Couleur principale',
            'secondary'  => 'Couleur secondaire',
            'accent'     => 'Couleur d\'accent',
            'light'      => 'Couleur claire',
            'text_dark'  => 'Texte sombre',
            'text_light' => 'Texte clair',
            'bg_body'    => 'Fond de page',
          ];
          foreach ($colorLabels as $k => $label):
            $val = $config['colors'][$k] ?? '#000000';
          ?>
          <div class="admin-form-group">
            <label class="admin-label"><?= $label ?></label>
            <div class="color-input-wrap">
              <input type="color" class="color-picker" value="<?= e($val) ?>" data-target="color-text-<?= $k ?>">
              <input type="text" class="admin-input color-text-input" id="color-text-<?= $k ?>"
                     data-config="colors.<?= $k ?>" value="<?= e($val) ?>" placeholder="#013336" maxlength="9">
            </div>
          </div>
          <?php endforeach; ?>
        </div>
        <div class="color-preview-bar" id="colorPreviewBar">
          <div style="background:<?= e($colors['primary']) ?>" title="Principale"></div>
          <div style="background:<?= e($colors['secondary']) ?>" title="Secondaire"></div>
          <div style="background:<?= e($colors['accent']) ?>" title="Accent"></div>
          <div style="background:<?= e($colors['light']) ?>" title="Claire"></div>
        </div>
      </div>

      <div class="admin-section">
        <h2 class="admin-section-title">Typographie</h2>
        <p class="admin-hint">Saisissez le nom exact de la Google Font (ex: "Playfair Display", "Inter", "Montserrat").</p>
        <div class="admin-grid-2">
          <div class="admin-form-group">
            <label class="admin-label">Police des titres</label>
            <input type="text" class="admin-input" id="fontHeading" data-config="fonts.heading" value="<?= e($config['fonts']['heading']) ?>" placeholder="Playfair Display">
            <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" class="admin-link">Parcourir Google Fonts →</a>
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Police du corps</label>
            <input type="text" class="admin-input" id="fontBody" data-config="fonts.body" value="<?= e($config['fonts']['body']) ?>" placeholder="Inter">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Graisse des titres</label>
            <select class="admin-input" data-config="fonts.heading_weight">
              <?php foreach (['400','500','600','700','800','900'] as $w): ?>
              <option value="<?= $w ?>" <?= ($config['fonts']['heading_weight'] ?? '700') === $w ? 'selected' : '' ?>><?= $w ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Graisse du corps</label>
            <select class="admin-input" data-config="fonts.body_weight">
              <?php foreach (['300','400','500','600'] as $w): ?>
              <option value="<?= $w ?>" <?= ($config['fonts']['body_weight'] ?? '400') === $w ? 'selected' : '' ?>><?= $w ?></option>
              <?php endforeach; ?>
            </select>
          </div>
        </div>
        <div class="font-preview" id="fontPreview">
          <span style="font-family:'<?= e($config['fonts']['heading']) ?>',serif;font-size:2rem;font-weight:<?= e($config['fonts']['heading_weight'] ?? '700') ?>">Aa — Titre</span>
          <span style="font-family:'<?= e($config['fonts']['body']) ?>',sans-serif;font-size:1rem">Corps de texte — Lorem ipsum dolor sit amet.</span>
        </div>
      </div>

      <div class="admin-section">
        <h2 class="admin-section-title">Médias d'identité</h2>
        <div class="admin-grid-2">
          <div class="admin-form-group">
            <label class="admin-label">Logo (URL ou chemin)</label>
            <input type="text" class="admin-input" data-config="site.logo" value="<?= e($config['site']['logo']) ?>" placeholder="uploads/images/logo.png">
            <button class="admin-btn admin-btn-outline admin-btn-sm mt-1 open-media-picker" data-target="site.logo" data-type="images">Choisir depuis les médias</button>
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Favicon (URL ou chemin)</label>
            <input type="text" class="admin-input" data-config="site.favicon" value="<?= e($config['site']['favicon']) ?>" placeholder="uploads/images/favicon.ico">
            <button class="admin-btn admin-btn-outline admin-btn-sm mt-1 open-media-picker" data-target="site.favicon" data-type="images">Choisir depuis les médias</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CONTENT ===== -->
    <section class="admin-tab" id="tab-content" aria-label="Contenu">
      <!-- Sub-tabs for sections -->
      <div class="sub-tabs">
        <button class="sub-tab-btn active" data-subtab="c-hero">Héro</button>
        <button class="sub-tab-btn" data-subtab="c-about">À propos</button>
        <button class="sub-tab-btn" data-subtab="c-services">Services</button>
        <button class="sub-tab-btn" data-subtab="c-portfolio">Portfolio</button>
        <button class="sub-tab-btn" data-subtab="c-process">Processus</button>
        <button class="sub-tab-btn" data-subtab="c-testimonials">Témoignages</button>
        <button class="sub-tab-btn" data-subtab="c-contact">Contact</button>
        <button class="sub-tab-btn" data-subtab="c-footer">Footer</button>
      </div>

      <!-- HERO -->
      <div class="sub-tab-content active" id="c-hero">
        <div class="admin-section">
          <h2 class="admin-section-title">Section Héro</h2>
          <?= sectionBgLinkFields('hero', $content['hero']) ?>
          <div class="admin-grid-2">
            <div class="admin-form-group">
              <label class="admin-label">Étiquette</label>
              <input type="text" class="admin-input" data-content="hero.eyebrow" value="<?= e($content['hero']['eyebrow']) ?>">
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Titre principal (H1)</label>
              <input type="text" class="admin-input" data-content="hero.title" value="<?= e($content['hero']['title']) ?>">
            </div>
            <div class="admin-form-group admin-col-2">
              <label class="admin-label">Sous-titre</label>
              <textarea class="admin-input admin-textarea" data-content="hero.subtitle" rows="3"><?= e($content['hero']['subtitle']) ?></textarea>
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Bouton principal — Texte</label>
              <input type="text" class="admin-input" data-content="hero.cta_primary_text" value="<?= e($content['hero']['cta_primary_text']) ?>">
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Bouton principal — Lien</label>
              <input type="text" class="admin-input" data-content="hero.cta_primary_link" value="<?= e($content['hero']['cta_primary_link']) ?>">
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Bouton secondaire — Texte</label>
              <input type="text" class="admin-input" data-content="hero.cta_secondary_text" value="<?= e($content['hero']['cta_secondary_text']) ?>">
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Bouton secondaire — Lien</label>
              <input type="text" class="admin-input" data-content="hero.cta_secondary_link" value="<?= e($content['hero']['cta_secondary_link']) ?>">
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Image héro (URL)</label>
              <input type="text" class="admin-input" data-content="hero.image" value="<?= e($content['hero']['image']) ?>">
              <button class="admin-btn admin-btn-outline admin-btn-sm mt-1 open-media-picker" data-target-content="hero.image" data-type="images">Choisir depuis les médias</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ABOUT -->
      <div class="sub-tab-content" id="c-about">
        <div class="admin-section">
          <h2 class="admin-section-title">Section À propos</h2>
          <?= sectionBgLinkFields('about', $content['about']) ?>
          <div class="admin-grid-2">
            <div class="admin-form-group">
              <label class="admin-label">Étiquette</label>
              <input type="text" class="admin-input" data-content="about.eyebrow" value="<?= e($content['about']['eyebrow']) ?>">
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Titre</label>
              <input type="text" class="admin-input" data-content="about.title" value="<?= e($content['about']['title']) ?>">
            </div>
            <div class="admin-form-group admin-col-2">
              <label class="admin-label">Texte</label>
              <textarea class="admin-input admin-textarea" data-content="about.text" rows="5"><?= e($content['about']['text']) ?></textarea>
            </div>
            <div class="admin-form-group admin-col-2">
              <label class="admin-label">Compétences (une par ligne)</label>
              <textarea class="admin-input admin-textarea" data-content-array="about.skills" rows="5"><?= e(implode("\n", $content['about']['skills'] ?? [])) ?></textarea>
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Image (URL)</label>
              <input type="text" class="admin-input" data-content="about.image" value="<?= e($content['about']['image']) ?>">
              <button class="admin-btn admin-btn-outline admin-btn-sm mt-1 open-media-picker" data-target-content="about.image" data-type="images">Choisir depuis les médias</button>
            </div>
          </div>
        </div>
      </div>

      <!-- SERVICES -->
      <div class="sub-tab-content" id="c-services">
        <div class="admin-section">
          <h2 class="admin-section-title">Section Services</h2>
          <?= sectionBgLinkFields('services', $content['services']) ?>
          <div class="admin-grid-2">
            <div class="admin-form-group">
              <label class="admin-label">Étiquette</label>
              <input type="text" class="admin-input" data-content="services.eyebrow" value="<?= e($content['services']['eyebrow']) ?>">
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Titre</label>
              <input type="text" class="admin-input" data-content="services.title" value="<?= e($content['services']['title']) ?>">
            </div>
            <div class="admin-form-group admin-col-2">
              <label class="admin-label">Sous-titre</label>
              <input type="text" class="admin-input" data-content="services.subtitle" value="<?= e($content['services']['subtitle']) ?>">
            </div>
          </div>
          <h3 class="admin-subsection-title">Cartes de services</h3>
          <div id="servicesItems">
            <?php foreach ($content['services']['items'] as $i => $item): ?>
            <div class="admin-repeater-item" data-index="<?= $i ?>">
              <div class="repeater-header">
                <span>Service <?= $i + 1 ?></span>
                <button class="admin-btn-icon admin-btn-danger repeater-remove" aria-label="Supprimer">×</button>
              </div>
              <div class="admin-grid-2">
                <div class="admin-form-group">
                  <label class="admin-label">Icône (emoji)</label>
                  <input type="text" class="admin-input service-icon" value="<?= e($item['icon']) ?>" placeholder="🎨">
                </div>
                <div class="admin-form-group">
                  <label class="admin-label">Titre</label>
                  <input type="text" class="admin-input service-title" value="<?= e($item['title']) ?>">
                </div>
                <div class="admin-form-group admin-col-2">
                  <label class="admin-label">Description</label>
                  <textarea class="admin-input admin-textarea service-text" rows="2"><?= e($item['text']) ?></textarea>
                </div>
                <div class="admin-form-group">
                  <label class="admin-label">Couleur d'accent</label>
                  <div class="color-input-wrap">
                    <input type="color" class="color-picker" value="<?= e($item['color']) ?>" data-target="svc-color-<?= $i ?>">
                    <input type="text" class="admin-input color-text-input service-color" id="svc-color-<?= $i ?>" value="<?= e($item['color']) ?>">
                  </div>
                </div>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
          <button class="admin-btn admin-btn-outline" id="addService">+ Ajouter un service</button>
        </div>
      </div>

      <!-- PORTFOLIO -->
      <div class="sub-tab-content" id="c-portfolio">
        <div class="admin-section">
          <h2 class="admin-section-title">Section Portfolio</h2>
          <?= sectionBgLinkFields('portfolio', $content['portfolio']) ?>
          <div class="admin-grid-2">
            <div class="admin-form-group">
              <label class="admin-label">Étiquette</label>
              <input type="text" class="admin-input" data-content="portfolio.eyebrow" value="<?= e($content['portfolio']['eyebrow']) ?>">
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Titre</label>
              <input type="text" class="admin-input" data-content="portfolio.title" value="<?= e($content['portfolio']['title']) ?>">
            </div>
            <div class="admin-form-group admin-col-2">
              <label class="admin-label">Sous-titre</label>
              <input type="text" class="admin-input" data-content="portfolio.subtitle" value="<?= e($content['portfolio']['subtitle']) ?>">
            </div>
          </div>
          <h3 class="admin-subsection-title">Projets</h3>
          <div id="portfolioItems">
            <?php foreach ($content['portfolio']['items'] as $i => $item): ?>
            <div class="admin-repeater-item" data-index="<?= $i ?>">
              <div class="repeater-header">
                <span>Projet <?= $i + 1 ?></span>
                <button class="admin-btn-icon admin-btn-danger repeater-remove" aria-label="Supprimer">×</button>
              </div>
              <div class="admin-grid-2">
                <div class="admin-form-group">
                  <label class="admin-label">Titre</label>
                  <input type="text" class="admin-input pf-title" value="<?= e($item['title']) ?>">
                </div>
                <div class="admin-form-group">
                  <label class="admin-label">Catégorie</label>
                  <input type="text" class="admin-input pf-category" value="<?= e($item['category']) ?>" placeholder="Identité visuelle">
                </div>
                <div class="admin-form-group">
                  <label class="admin-label">Image (URL)</label>
                  <input type="text" class="admin-input pf-image" value="<?= e($item['image']) ?>">
                  <button class="admin-btn admin-btn-outline admin-btn-sm mt-1 pf-media-pick open-media-picker" data-type="images" data-target-field="pf-image">Médias</button>
                </div>
                <div class="admin-form-group">
                  <label class="admin-label">Lien du projet (optionnel)</label>
                  <input type="url" class="admin-input pf-link" value="<?= e($item['link']) ?>" placeholder="https://...">
                </div>
                <div class="admin-form-group">
                  <label class="admin-label">Couleur de fond</label>
                  <div class="color-input-wrap">
                    <input type="color" class="color-picker" value="<?= e($item['color']) ?>" data-target="pf-color-<?= $i ?>">
                    <input type="text" class="admin-input color-text-input pf-color" id="pf-color-<?= $i ?>" value="<?= e($item['color']) ?>">
                  </div>
                </div>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
          <button class="admin-btn admin-btn-outline" id="addPortfolioItem">+ Ajouter un projet</button>
        </div>
      </div>

      <!-- PROCESS -->
      <div class="sub-tab-content" id="c-process">
        <div class="admin-section">
          <h2 class="admin-section-title">Section Processus</h2>
          <?= sectionBgLinkFields('process', $content['process']) ?>
          <div class="admin-grid-2">
            <div class="admin-form-group">
              <label class="admin-label">Étiquette</label>
              <input type="text" class="admin-input" data-content="process.eyebrow" value="<?= e($content['process']['eyebrow']) ?>">
            </div>
            <div class="admin-form-group">
              <label class="admin-label">Titre</label>
              <input type="text" class="admin-input" data-content="process.title" value="<?= e($content['process']['title']) ?>">
            </div>
            <div class="admin-form-group admin-col-2">
              <label class="admin-label">Sous-titre</label>
              <input type="text" class="admin-input" data-content="process.subtitle" value="<?= e($content['process']['subtitle']) ?>">
            </div>
          </div>
          <h3 class="admin-subsection-title">Étapes</h3>
          <div id="processSteps">
            <?php foreach ($content['process']['steps'] as $i => $step): ?>
            <div class="admin-repeater-item" data-index="<?= $i ?>">
              <div class="repeater-header"><span>Étape <?= $i + 1 ?></span><button class="admin-btn-icon admin-btn-danger repeater-remove" aria-label="Supprimer">×</button></div>
              <div class="admin-grid-2">
                <div class="admin-form-group"><label class="admin-label">Numéro</label><input type="text" class="admin-input ps-number" value="<?= e($step['number']) ?>" placeholder="01"></div>
                <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input ps-title" value="<?= e($step['title']) ?>"></div>
                <div class="admin-form-group admin-col-2"><label class="admin-label">Description</label><textarea class="admin-input admin-textarea ps-text" rows="2"><?= e($step['text']) ?></textarea></div>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
          <button class="admin-btn admin-btn-outline" id="addProcessStep">+ Ajouter une étape</button>
        </div>
      </div>

      <!-- TESTIMONIALS -->
      <div class="sub-tab-content" id="c-testimonials">
        <div class="admin-section">
          <h2 class="admin-section-title">Section Témoignages</h2>
          <?= sectionBgLinkFields('testimonials', $content['testimonials']) ?>
          <div class="admin-grid-2">
            <div class="admin-form-group"><label class="admin-label">Étiquette</label><input type="text" class="admin-input" data-content="testimonials.eyebrow" value="<?= e($content['testimonials']['eyebrow']) ?>"></div>
            <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input" data-content="testimonials.title" value="<?= e($content['testimonials']['title']) ?>"></div>
          </div>
          <h3 class="admin-subsection-title">Témoignages</h3>
          <div id="testimonialItems">
            <?php foreach ($content['testimonials']['items'] as $i => $t): ?>
            <div class="admin-repeater-item" data-index="<?= $i ?>">
              <div class="repeater-header"><span>Témoignage <?= $i + 1 ?></span><button class="admin-btn-icon admin-btn-danger repeater-remove" aria-label="Supprimer">×</button></div>
              <div class="admin-grid-2">
                <div class="admin-form-group admin-col-2"><label class="admin-label">Citation</label><textarea class="admin-input admin-textarea testi-quote" rows="3"><?= e($t['quote']) ?></textarea></div>
                <div class="admin-form-group"><label class="admin-label">Auteur</label><input type="text" class="admin-input testi-author" value="<?= e($t['author']) ?>"></div>
                <div class="admin-form-group"><label class="admin-label">Rôle</label><input type="text" class="admin-input testi-role" value="<?= e($t['role']) ?>"></div>
                <div class="admin-form-group"><label class="admin-label">Entreprise</label><input type="text" class="admin-input testi-company" value="<?= e($t['company']) ?>"></div>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
          <button class="admin-btn admin-btn-outline" id="addTestimonial">+ Ajouter un témoignage</button>
        </div>
      </div>

      <!-- CONTACT SECTION -->
      <div class="sub-tab-content" id="c-contact">
        <div class="admin-section">
          <h2 class="admin-section-title">Section Contact</h2>
          <?= sectionBgLinkFields('contact', $content['contact']) ?>
          <div class="admin-grid-2">
            <div class="admin-form-group"><label class="admin-label">Étiquette</label><input type="text" class="admin-input" data-content="contact.eyebrow" value="<?= e($content['contact']['eyebrow']) ?>"></div>
            <div class="admin-form-group"><label class="admin-label">Titre</label><input type="text" class="admin-input" data-content="contact.title" value="<?= e($content['contact']['title']) ?>"></div>
            <div class="admin-form-group admin-col-2"><label class="admin-label">Sous-titre</label><textarea class="admin-input admin-textarea" data-content="contact.subtitle" rows="2"><?= e($content['contact']['subtitle']) ?></textarea></div>
            <div class="admin-form-group"><label class="admin-label">Email de contact</label><input type="email" class="admin-input" data-content="contact.email" value="<?= e($content['contact']['email']) ?>"></div>
            <div class="admin-form-group"><label class="admin-label">Téléphone</label><input type="tel" class="admin-input" data-content="contact.phone" value="<?= e($content['contact']['phone']) ?>"></div>
          </div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="sub-tab-content" id="c-footer">
        <div class="admin-section">
          <h2 class="admin-section-title">Footer</h2>
          <?= sectionBgLinkFields('footer', $content['footer']) ?>
          <div class="admin-form-group">
            <label class="admin-label">Texte de copyright</label>
            <input type="text" class="admin-input" data-content="footer.text" value="<?= e($content['footer']['text']) ?>">
          </div>
        </div>
      </div>
    </section>

    <!-- ===== MEDIA ===== -->
    <section class="admin-tab" id="tab-media" aria-label="Gestion des médias">
      <div class="admin-section">
        <div class="media-tabs">
          <button class="media-tab-btn active" data-media-type="images">Images</button>
          <button class="media-tab-btn" data-media-type="videos">Vidéos</button>
        </div>
        <div class="media-upload-zone" id="mediaUploadZone">
          <div class="upload-zone-content">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
            <p>Glissez-déposez vos fichiers ici</p>
            <p class="upload-hint">ou</p>
            <label class="admin-btn admin-btn-primary" for="fileUploadInput">Parcourir les fichiers</label>
            <input type="file" id="fileUploadInput" multiple accept="image/*,video/*" hidden aria-label="Sélectionner des fichiers">
          </div>
          <div class="upload-progress-list" id="uploadProgressList"></div>
        </div>
        <div class="media-grid" id="mediaGrid" aria-label="Fichiers médias"></div>
      </div>
    </section>

    <!-- ===== SEO ===== -->
    <section class="admin-tab" id="tab-seo" aria-label="SEO">
      <div class="admin-section">
        <h2 class="admin-section-title">Référencement (SEO)</h2>
        <div class="admin-grid-2">
          <div class="admin-form-group">
            <label class="admin-label">URL canonique</label>
            <input type="url" class="admin-input" data-config="seo.canonical" value="<?= e($config['seo']['canonical']) ?>" placeholder="https://votresite.fr/">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Robots</label>
            <select class="admin-input" data-config="seo.robots">
              <option value="index, follow" <?= $config['seo']['robots'] === 'index, follow' ? 'selected' : '' ?>>index, follow (recommandé)</option>
              <option value="noindex, nofollow" <?= $config['seo']['robots'] === 'noindex, nofollow' ? 'selected' : '' ?>>noindex, nofollow</option>
              <option value="noindex, follow" <?= $config['seo']['robots'] === 'noindex, follow' ? 'selected' : '' ?>>noindex, follow</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Type de schéma (Schema.org)</label>
            <select class="admin-input" data-config="seo.schema_type">
              <option value="Person" <?= $config['seo']['schema_type'] === 'Person' ? 'selected' : '' ?>>Person (individu)</option>
              <option value="Organization" <?= $config['seo']['schema_type'] === 'Organization' ? 'selected' : '' ?>>Organization (entreprise)</option>
              <option value="LocalBusiness" <?= $config['seo']['schema_type'] === 'LocalBusiness' ? 'selected' : '' ?>>LocalBusiness</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Type Open Graph</label>
            <select class="admin-input" data-config="seo.og_type">
              <option value="website" <?= $config['seo']['og_type'] === 'website' ? 'selected' : '' ?>>website</option>
              <option value="profile" <?= $config['seo']['og_type'] === 'profile' ? 'selected' : '' ?>>profile</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Image OG (URL)</label>
            <input type="text" class="admin-input" data-config="seo.og_image" value="<?= e($config['seo']['og_image']) ?>" placeholder="uploads/images/og-image.jpg">
            <p class="admin-hint">Recommandé : 1200×630px</p>
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Twitter Card</label>
            <select class="admin-input" data-config="seo.twitter_card">
              <option value="summary_large_image" <?= $config['seo']['twitter_card'] === 'summary_large_image' ? 'selected' : '' ?>>summary_large_image</option>
              <option value="summary" <?= $config['seo']['twitter_card'] === 'summary' ? 'selected' : '' ?>>summary</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Compte Twitter/X (@ inclus)</label>
            <input type="text" class="admin-input" data-config="seo.twitter_site" value="<?= e($config['seo']['twitter_site']) ?>" placeholder="@votrecompte">
          </div>
        </div>
      </div>
    </section>

    <!-- ===== EMAILJS ===== -->
    <section class="admin-tab" id="tab-contact" aria-label="EmailJS">
      <div class="admin-section">
        <h2 class="admin-section-title">Configuration EmailJS</h2>
        <div class="admin-alert admin-alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Créez un compte sur <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer">emailjs.com</a>, créez un service et un template, puis renseignez les identifiants ci-dessous.
        </div>
        <div class="admin-grid-2">
          <div class="admin-form-group">
            <label class="admin-label">Service ID</label>
            <input type="text" class="admin-input" data-config="emailjs.service_id" value="<?= e($config['emailjs']['service_id']) ?>" placeholder="service_xxxxxxx">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Template ID</label>
            <input type="text" class="admin-input" data-config="emailjs.template_id" value="<?= e($config['emailjs']['template_id']) ?>" placeholder="template_xxxxxxx">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Clé publique (Public Key)</label>
            <input type="text" class="admin-input" data-config="emailjs.public_key" value="<?= e($config['emailjs']['public_key']) ?>" placeholder="xxxxxxxxxxxxxxxxxxx">
          </div>
        </div>
      </div>
    </section>

    <!-- ===== TRACKING ===== -->
    <section class="admin-tab" id="tab-tracking" aria-label="Tracking">
      <div class="admin-section">
        <h2 class="admin-section-title">Google Tag Manager</h2>
        <div class="admin-form-group">
          <label class="admin-label">GTM ID</label>
          <input type="text" class="admin-input" data-config="tracking.gtm_id" value="<?= e($config['tracking']['gtm_id']) ?>" placeholder="GTM-XXXX">
        </div>
      </div>
      <div class="admin-section">
        <h2 class="admin-section-title">Google Analytics / Gtag</h2>
        <div class="admin-grid-2">
          <div class="admin-form-group">
            <label class="admin-label">GA4 Measurement ID (G-XXXXXXX)</label>
            <input type="text" class="admin-input" data-config="tracking.gtag_id" value="<?= e($config['tracking']['gtag_id']) ?>" placeholder="G-XXXXXXXXX">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">UA Analytics ID</label>
            <input type="text" class="admin-input" data-config="tracking.analytics_ua" value="<?= e($config['tracking']['analytics_ua']) ?>" placeholder="UA-XXXXXXXX-X">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">UA Old (gajs)</label>
            <input type="text" class="admin-input" data-config="tracking.analytics_ua_old" value="<?= e($config['tracking']['analytics_ua_old']) ?>" placeholder="UA-XXXXXXXX-X">
          </div>
        </div>
      </div>
      <div class="admin-section">
        <h2 class="admin-section-title">Matomo</h2>
        <div class="admin-grid-2">
          <div class="admin-form-group">
            <label class="admin-label">URL Matomo Tag Manager</label>
            <input type="url" class="admin-input" data-config="tracking.matomo_tm_url" value="<?= e($config['tracking']['matomo_tm_url']) ?>" placeholder="https://matomo.votresite.fr/">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Matomo Site ID</label>
            <input type="number" class="admin-input" data-config="tracking.matomo_id" value="<?= e($config['tracking']['matomo_id']) ?>" placeholder="1">
          </div>
        </div>
      </div>
      <div class="admin-section">
        <h2 class="admin-section-title">Autres services</h2>
        <div class="admin-grid-2">
          <div class="admin-form-group">
            <label class="admin-label">TikTok Pixel ID</label>
            <input type="text" class="admin-input" data-config="tracking.tiktok_id" value="<?= e($config['tracking']['tiktok_id']) ?>" placeholder="XXXXXXXXXXXXXXXXXXXXXXXX">
          </div>
          <div class="admin-form-group">
            <label class="admin-label">Google Maps API Key</label>
            <input type="text" class="admin-input" data-config="tracking.googlemaps_key" value="<?= e($config['tracking']['googlemaps_key']) ?>" placeholder="AIza...">
          </div>
          <div class="admin-form-group admin-col-2">
            <label class="admin-label">Code personnalisé &lt;head&gt;</label>
            <textarea class="admin-input admin-textarea admin-code" data-config="tracking.custom_head" rows="5" placeholder="<!-- GTM, pixels personnalisés... -->"><?= e($config['tracking']['custom_head']) ?></textarea>
          </div>
          <div class="admin-form-group admin-col-2">
            <label class="admin-label">Code personnalisé fin &lt;body&gt;</label>
            <textarea class="admin-input admin-textarea admin-code" data-config="tracking.custom_body" rows="5" placeholder="<!-- Scripts analytics... -->"><?= e($config['tracking']['custom_body']) ?></textarea>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== COOKIES ===== -->
    <section class="admin-tab" id="tab-cookies" aria-label="Cookies">
      <div class="admin-section">
        <h2 class="admin-section-title">Tarte au Citron</h2>
        <div class="admin-form-group">
          <label class="admin-toggle-label">
            <input type="checkbox" class="admin-toggle" data-config-bool="cookies.tac_enabled" <?= !empty($config['cookies']['tac_enabled']) ? 'checked' : '' ?>>
            <span>Activer Tarte au Citron</span>
          </label>
        </div>
        <div class="admin-grid-2">
          <div class="admin-form-group">
            <label class="admin-label">Position de la bannière</label>
            <select class="admin-input" data-config="cookies.tac_position">
              <option value="bottom" <?= $config['cookies']['tac_position'] === 'bottom' ? 'selected' : '' ?>>Bas de page</option>
              <option value="top" <?= $config['cookies']['tac_position'] === 'top' ? 'selected' : '' ?>>Haut de page</option>
              <option value="middle" <?= $config['cookies']['tac_position'] === 'middle' ? 'selected' : '' ?>>Centré</option>
            </select>
          </div>
        </div>
        <h3 class="admin-subsection-title">Services activés</h3>
        <p class="admin-hint">Activez uniquement les services que vous utilisez (IDs configurés dans l'onglet Tracking).</p>
        <div class="admin-grid-2">
          <?php
          $tacServices = [
            'googlefonts'      => 'Google Fonts',
            'googletagmanager' => 'Google Tag Manager',
            'gtag'             => 'Google Analytics 4 (gtag)',
            'gajs'             => 'Google Analytics (gajs ancien)',
            'analytics'        => 'Universal Analytics (analytics.js)',
            'googlemaps'       => 'Google Maps',
            'matomotm'         => 'Matomo Tag Manager',
            'matomo'           => 'Matomo Analytics',
            'facebook'         => 'Facebook / Meta',
            'facebookpost'     => 'Facebook Post',
            'twitter'          => 'X / Twitter',
            'twitterembed'     => 'Twitter Embed',
            'tiktok'           => 'TikTok Pixel',
            'tiktokvideo'      => 'TikTok Video',
          ];
          foreach ($tacServices as $k => $label):
            $checked = !empty($config['cookies']['services'][$k]);
          ?>
          <div class="admin-form-group">
            <label class="admin-toggle-label">
              <input type="checkbox" class="admin-toggle tac-service-toggle" data-service="<?= $k ?>" <?= $checked ? 'checked' : '' ?>>
              <span><?= $label ?></span>
            </label>
          </div>
          <?php endforeach; ?>
        </div>
      </div>
    </section>

    <!-- ===== SECURITY ===== -->
    <section class="admin-tab" id="tab-security" aria-label="Sécurité">
      <div class="admin-section">
        <h2 class="admin-section-title">Changer le mot de passe</h2>
        <div class="admin-alert admin-alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Le mot de passe par défaut est <strong>Admin2024!</strong> — changez-le immédiatement.
        </div>
        <div class="admin-form" style="max-width:480px">
          <div class="admin-form-group">
            <label class="admin-label" for="currentPwd">Mot de passe actuel</label>
            <div class="password-wrap">
              <input type="password" id="currentPwd" class="admin-input" placeholder="••••••••" autocomplete="current-password">
              <button type="button" class="toggle-pwd" data-target="currentPwd" aria-label="Afficher">
                <svg class="eye-show" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg class="eye-hide" hidden xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>
          <div class="admin-form-group">
            <label class="admin-label" for="newPwd">Nouveau mot de passe (min. 8 caractères)</label>
            <input type="password" id="newPwd" class="admin-input" placeholder="••••••••" autocomplete="new-password">
          </div>
          <div class="admin-form-group">
            <label class="admin-label" for="confirmPwd">Confirmer le nouveau mot de passe</label>
            <input type="password" id="confirmPwd" class="admin-input" placeholder="••••••••" autocomplete="new-password">
          </div>
          <div id="pwdMessage" class="admin-alert" hidden></div>
          <button class="admin-btn admin-btn-primary" id="changePwdBtn">Mettre à jour le mot de passe</button>
        </div>
      </div>
    </section>

  </div><!-- /admin-content -->
</div><!-- /admin-main -->

<!-- MEDIA PICKER MODAL -->
<div class="admin-modal" id="mediaPickerModal" role="dialog" aria-modal="true" aria-label="Sélectionner un média" hidden>
  <div class="admin-modal-backdrop"></div>
  <div class="admin-modal-content">
    <div class="admin-modal-header">
      <h3>Sélectionner un média</h3>
      <button class="admin-modal-close" aria-label="Fermer">×</button>
    </div>
    <div class="admin-modal-body">
      <div class="media-grid" id="modalMediaGrid"></div>
    </div>
  </div>
</div>

<script>
window.ADMIN_DATA = {
  config:  <?= j($config) ?>,
  content: <?= j($content) ?>
};
</script>
<script src="assets/js/admin.js"></script>
</body>
</html>
<?php
/* Helper: render bg-color + link-button fields for a section */
function sectionBgLinkFields(string $section, array $data): string {
    $bg      = htmlspecialchars($data['bg_color'] ?? '#ffffff', ENT_QUOTES, 'UTF-8');
    $show    = !empty($data['show_link_button']) ? 'checked' : '';
    $btnText = htmlspecialchars($data['link_button_text'] ?? '', ENT_QUOTES, 'UTF-8');
    $btnUrl  = htmlspecialchars($data['link_button_url'] ?? '', ENT_QUOTES, 'UTF-8');
    return <<<HTML
    <div class="section-block-controls">
      <div class="admin-form-group">
        <label class="admin-label">Couleur de fond de la section</label>
        <div class="color-input-wrap">
          <input type="color" class="color-picker" value="{$bg}" data-target="bg-{$section}">
          <input type="text" class="admin-input color-text-input" id="bg-{$section}" data-content="{$section}.bg_color" value="{$bg}">
        </div>
      </div>
      <div class="admin-form-group">
        <label class="admin-toggle-label">
          <input type="checkbox" class="admin-toggle" data-content-bool="{$section}.show_link_button" {$show}>
          <span>Afficher un bouton de lien</span>
        </label>
      </div>
      <div class="link-btn-fields" style="display:flex;gap:1rem;flex-wrap:wrap;">
        <div class="admin-form-group" style="flex:1;min-width:200px">
          <label class="admin-label">Texte du bouton</label>
          <input type="text" class="admin-input" data-content="{$section}.link_button_text" value="{$btnText}" placeholder="En savoir plus">
        </div>
        <div class="admin-form-group" style="flex:1;min-width:200px">
          <label class="admin-label">URL du bouton</label>
          <input type="url" class="admin-input" data-content="{$section}.link_button_url" value="{$btnUrl}" placeholder="https://...">
        </div>
      </div>
    </div>
    HTML;
}
?>
