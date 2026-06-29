<?php
$config  = json_decode(file_get_contents(__DIR__ . '/data/config.json'), true);
$content = json_decode(file_get_contents(__DIR__ . '/data/content.json'), true);

$site    = $config['site'];
$colors  = $config['colors'];
$fonts   = $config['fonts'];
$social  = $config['social'];
$seo     = $config['seo'];
$emailjs = $config['emailjs'];
$track   = $config['tracking'];
$cookies = $config['cookies'];
$nav     = $config['nav'];

$baseUrl = (!empty($site['url'])) ? rtrim($site['url'], '/') : '';
$canonical = !empty($seo['canonical']) ? $seo['canonical'] : $baseUrl . '/';

function e($s) { return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8'); }
function bg($c) { return $c ? ' style="background-color:' . e($c) . '"' : ''; }
?>
<!DOCTYPE html>
<html lang="<?= e($site['language']) ?>" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <!-- SEO Primary -->
  <title><?= e($site['name']) ?> — <?= e($site['tagline']) ?></title>
  <meta name="description" content="<?= e($site['description']) ?>">
  <meta name="keywords" content="<?= e($site['keywords']) ?>">
  <meta name="author" content="<?= e($site['author']) ?>">
  <meta name="robots" content="<?= e($seo['robots']) ?>">
  <link rel="canonical" href="<?= e($canonical) ?>">

  <!-- Open Graph -->
  <meta property="og:type" content="<?= e($seo['og_type']) ?>">
  <meta property="og:title" content="<?= e($site['name']) ?> — <?= e($site['tagline']) ?>">
  <meta property="og:description" content="<?= e($site['description']) ?>">
  <meta property="og:url" content="<?= e($canonical) ?>">
  <meta property="og:locale" content="fr_FR">
  <?php if (!empty($seo['og_image'])): ?>
  <meta property="og:image" content="<?= e($baseUrl . '/' . $seo['og_image']) ?>">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <?php endif; ?>

  <!-- Twitter Card -->
  <meta name="twitter:card" content="<?= e($seo['twitter_card']) ?>">
  <?php if (!empty($seo['twitter_site'])): ?>
  <meta name="twitter:site" content="<?= e($seo['twitter_site']) ?>">
  <?php endif; ?>
  <meta name="twitter:title" content="<?= e($site['name']) ?> — <?= e($site['tagline']) ?>">
  <meta name="twitter:description" content="<?= e($site['description']) ?>">
  <?php if (!empty($seo['og_image'])): ?>
  <meta name="twitter:image" content="<?= e($baseUrl . '/' . $seo['og_image']) ?>">
  <?php endif; ?>

  <!-- Favicon -->
  <?php if (!empty($site['favicon'])): ?>
  <link rel="icon" href="<?= e($baseUrl . '/' . $site['favicon']) ?>" type="image/x-icon">
  <?php else: ?>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23013336'/><text y='.9em' font-size='70' x='10' fill='%2356b578'>VP</text></svg>">
  <?php endif; ?>

  <!-- Tarte au Citron CSS -->
  <?php if (!empty($cookies['tac_enabled'])): ?>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tarteaucitronjs@1.19.0/css/tarteaucitron.css">
  <?php endif; ?>

  <!-- Google Fonts via Tarte au Citron (if disabled, load directly) -->
  <?php if (empty($cookies['tac_enabled']) || empty($cookies['services']['googlefonts'])): ?>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=<?= urlencode($fonts['heading']) ?>:wght@400;600;700;900&family=<?= urlencode($fonts['body']) ?>:wght@300;400;500;600&display=swap" rel="stylesheet">
  <?php endif; ?>

  <!-- Custom tracking codes in <head> -->
  <?php if (!empty($track['custom_head'])): ?>
  <?= $track['custom_head'] . "\n" ?>
  <?php endif; ?>

  <!-- Styles -->
  <link rel="stylesheet" href="assets/css/style.css">

  <!-- CSS Variables from config -->
  <style>
    :root {
      --color-primary:    <?= e($colors['primary']) ?>;
      --color-secondary:  <?= e($colors['secondary']) ?>;
      --color-accent:     <?= e($colors['accent']) ?>;
      --color-light:      <?= e($colors['light']) ?>;
      --color-text-dark:  <?= e($colors['text_dark']) ?>;
      --color-text-light: <?= e($colors['text_light']) ?>;
      --color-bg-body:    <?= e($colors['bg_body']) ?>;
      --font-heading:     '<?= e($fonts['heading']) ?>', Georgia, serif;
      --font-body:        '<?= e($fonts['body']) ?>', system-ui, sans-serif;
    }
  </style>

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "<?= e($seo['schema_type']) ?>",
    "name": "<?= e($site['author']) ?>",
    "jobTitle": "<?= e($site['tagline']) ?>",
    "description": "<?= e($site['description']) ?>",
    "url": "<?= e($canonical) ?>",
    <?php if (!empty($seo['og_image'])): ?>
    "image": "<?= e($baseUrl . '/' . $seo['og_image']) ?>",
    <?php endif; ?>
    <?php if (!empty($content['contact']['email'])): ?>
    "email": "<?= e($content['contact']['email']) ?>",
    <?php endif; ?>
    "sameAs": [
      <?php
        $sameAs = array_filter(array_values($social));
        echo implode(",\n      ", array_map(fn($u) => '"' . e($u) . '"', $sameAs));
      ?>
    ],
    "knowsAbout": ["Design Graphique", "Identité Visuelle", "Logotype", "Branding", "Print"]
  }
  </script>
</head>
<body itemscope itemtype="https://schema.org/WebPage">

<!-- =============== COOKIE MANAGER =============== -->
<?php if (!empty($cookies['tac_enabled'])): ?>
<script src="https://cdn.jsdelivr.net/npm/tarteaucitronjs@1.19.0/tarteaucitron.js"></script>
<script>
tarteaucitron.init({
  "privacyUrl": "",
  "bodyPosition": "<?= e($cookies['tac_position']) ?>",
  "hashtag": "#tarteaucitron",
  "cookieName": "tarteaucitron",
  "orientation": "<?= e($cookies['tac_position']) ?>",
  "showAlertSmall": false,
  "cookieslist": false,
  "closePopup": false,
  "showIcon": true,
  "iconSrc": "",
  "iconPosition": "BottomRight",
  "adblocker": false,
  "DenyAllCta": true,
  "AcceptAllCta": true,
  "highPrivacy": true,
  "handleBrowserDNTRequest": false,
  "removeCredit": false,
  "moreInfoLink": true,
  "useExternalCss": true,
  "useExternalJs": false,
  "readmoreLink": "",
  "mandatory": true,
  "mandatoryCta": true
});

<?php
$services = $cookies['services'];
$fontsFamily = urlencode($fonts['heading']) . '|' . urlencode($fonts['body']);
if (!empty($services['googlefonts'])): ?>
tarteaucitron.user.googleFonts = '<?= $fontsFamily ?>';
(tarteaucitron.job = tarteaucitron.job || []).push('googlefonts');
<?php endif;
if (!empty($services['googletagmanager']) && !empty($track['gtm_id'])): ?>
tarteaucitron.user.googletagmanagerId = '<?= e($track['gtm_id']) ?>';
(tarteaucitron.job = tarteaucitron.job || []).push('googletagmanager');
<?php endif;
if (!empty($services['gtag']) && !empty($track['gtag_id'])): ?>
tarteaucitron.user.gtagUa = '<?= e($track['gtag_id']) ?>';
tarteaucitron.user.gtagMore = function () {};
(tarteaucitron.job = tarteaucitron.job || []).push('gtag');
<?php endif;
if (!empty($services['gajs']) && !empty($track['analytics_ua_old'])): ?>
tarteaucitron.user.gajsUa = '<?= e($track['analytics_ua_old']) ?>';
tarteaucitron.user.gajsMore = function () {};
(tarteaucitron.job = tarteaucitron.job || []).push('gajs');
<?php endif;
if (!empty($services['analytics']) && !empty($track['analytics_ua'])): ?>
tarteaucitron.user.analyticsUa = '<?= e($track['analytics_ua']) ?>';
tarteaucitron.user.analyticsAnonymizeIp = true;
tarteaucitron.user.analyticsMore = function () {};
(tarteaucitron.job = tarteaucitron.job || []).push('analytics');
<?php endif;
if (!empty($services['googlemaps']) && !empty($track['googlemaps_key'])): ?>
tarteaucitron.user.googlemapsKey = '<?= e($track['googlemaps_key']) ?>';
(tarteaucitron.job = tarteaucitron.job || []).push('googlemaps');
<?php endif;
if (!empty($services['matomotm']) && !empty($track['matomo_tm_url'])): ?>
tarteaucitron.user.matomotmUrl = '<?= e($track['matomo_tm_url']) ?>';
(tarteaucitron.job = tarteaucitron.job || []).push('matomotm');
<?php endif;
if (!empty($services['matomo']) && !empty($track['matomo_id'])): ?>
tarteaucitron.user.matomoId = <?= (int)$track['matomo_id'] ?>;
(tarteaucitron.job = tarteaucitron.job || []).push('matomo');
<?php endif;
if (!empty($services['facebook'])): ?>
(tarteaucitron.job = tarteaucitron.job || []).push('facebook');
(tarteaucitron.job = tarteaucitron.job || []).push('facebookpost');
(tarteaucitron.job = tarteaucitron.job || []).push('facebooklikebox');
(tarteaucitron.job = tarteaucitron.job || []).push('facebookcomment');
<?php endif;
if (!empty($services['twitter'])): ?>
(tarteaucitron.job = tarteaucitron.job || []).push('twitter');
(tarteaucitron.job = tarteaucitron.job || []).push('twitterembed');
(tarteaucitron.job = tarteaucitron.job || []).push('twittertimeline');
<?php endif;
if (!empty($services['tiktok']) && !empty($track['tiktok_id'])): ?>
tarteaucitron.user.tiktokId = '<?= e($track['tiktok_id']) ?>';
tarteaucitron.user.tiktokMore = function () {};
(tarteaucitron.job = tarteaucitron.job || []).push('tiktok');
(tarteaucitron.job = tarteaucitron.job || []).push('tiktokvideo');
<?php endif; ?>
</script>
<?php endif; ?>

<!-- =============== HEADER / NAV =============== -->
<header class="site-header" id="top" role="banner" itemscope itemtype="https://schema.org/WPHeader">
  <nav class="nav-container" role="navigation" aria-label="Navigation principale">
    <a href="#top" class="nav-logo" aria-label="Retour en haut">
      <?php if (!empty($site['logo'])): ?>
        <img src="<?= e($site['logo']) ?>" alt="Logo <?= e($site['name']) ?>" class="logo-img" width="120" height="40">
      <?php else: ?>
        <span class="logo-text"><?= e($site['logo_text'] ?: substr($site['name'], 0, 2)) ?></span>
      <?php endif; ?>
    </a>
    <button class="nav-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav-menu">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-menu" id="nav-menu" role="list">
      <?php foreach ($nav['items'] as $item): ?>
      <li><a href="<?= e($item['href']) ?>" class="nav-link"><?= e($item['label']) ?></a></li>
      <?php endforeach; ?>
      <li><a href="#contact" class="nav-cta">Travaillons ensemble</a></li>
    </ul>
  </nav>
</header>

<!-- =============== HERO =============== -->
<section class="hero" id="hero" aria-label="Introduction" style="background-color:<?= e($content['hero']['bg_color']) ?>">
  <div class="hero-bg-blobs" aria-hidden="true">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>
  <div class="hero-container">
    <div class="hero-glass-card" data-aos="fade-up" itemscope itemtype="https://schema.org/Person">
      <span class="hero-eyebrow" data-aos="fade-down" data-aos-delay="100"><?= e($content['hero']['eyebrow']) ?></span>
      <h1 class="hero-title" itemprop="name" data-aos="fade-up" data-aos-delay="200">
        <?= e($content['hero']['title']) ?>
      </h1>
      <p class="hero-subtitle" itemprop="description" data-aos="fade-up" data-aos-delay="300">
        <?= e($content['hero']['subtitle']) ?>
      </p>
      <div class="hero-actions" data-aos="fade-up" data-aos-delay="400">
        <?php if (!empty($content['hero']['cta_primary_text'])): ?>
        <a href="<?= e($content['hero']['cta_primary_link']) ?>" class="btn btn-primary">
          <?= e($content['hero']['cta_primary_text']) ?>
        </a>
        <?php endif; ?>
        <?php if (!empty($content['hero']['cta_secondary_text'])): ?>
        <a href="<?= e($content['hero']['cta_secondary_link']) ?>" class="btn btn-ghost">
          <?= e($content['hero']['cta_secondary_text']) ?>
        </a>
        <?php endif; ?>
        <?php if (!empty($content['hero']['show_link_button']) && !empty($content['hero']['link_button_url'])): ?>
        <a href="<?= e($content['hero']['link_button_url']) ?>" class="btn btn-link-block" target="_blank" rel="noopener noreferrer">
          <?= e($content['hero']['link_button_text']) ?>
        </a>
        <?php endif; ?>
      </div>
    </div>
    <?php if (!empty($content['hero']['image'])): ?>
    <div class="hero-image-wrap" data-aos="fade-left" data-aos-delay="300">
      <img src="<?= e($content['hero']['image']) ?>" alt="<?= e($site['author']) ?>" class="hero-image" itemprop="image">
    </div>
    <?php endif; ?>
  </div>
  <div class="hero-scroll-indicator" aria-hidden="true">
    <div class="scroll-line"></div>
  </div>
</section>

<!-- =============== ABOUT =============== -->
<section class="section section-about" id="about" aria-labelledby="about-title"<?= bg($content['about']['bg_color']) ?>>
  <div class="container">
    <div class="section-inner about-grid">
      <?php if (!empty($content['about']['image'])): ?>
      <div class="about-visual" data-aos="fade-right">
        <div class="about-image-wrap">
          <img src="<?= e($content['about']['image']) ?>" alt="<?= e($site['author']) ?>" class="about-image">
          <div class="about-image-deco" aria-hidden="true"></div>
        </div>
      </div>
      <?php endif; ?>
      <div class="about-content" data-aos="fade-left">
        <span class="section-eyebrow"><?= e($content['about']['eyebrow']) ?></span>
        <h2 id="about-title" class="section-title"><?= e($content['about']['title']) ?></h2>
        <p class="section-text"><?= e($content['about']['text']) ?></p>
        <?php if (!empty($content['about']['skills'])): ?>
        <ul class="skills-list" role="list">
          <?php foreach ($content['about']['skills'] as $skill): ?>
          <li class="skill-tag"><?= e($skill) ?></li>
          <?php endforeach; ?>
        </ul>
        <?php endif; ?>
        <?php if (!empty($content['about']['show_link_button']) && !empty($content['about']['link_button_url'])): ?>
        <a href="<?= e($content['about']['link_button_url']) ?>" class="btn btn-primary mt-2" target="_blank" rel="noopener noreferrer">
          <?= e($content['about']['link_button_text']) ?>
        </a>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>

<!-- =============== SERVICES =============== -->
<section class="section section-services" id="services" aria-labelledby="services-title"<?= bg($content['services']['bg_color']) ?>>
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="section-eyebrow light"><?= e($content['services']['eyebrow']) ?></span>
      <h2 id="services-title" class="section-title light"><?= e($content['services']['title']) ?></h2>
      <?php if (!empty($content['services']['subtitle'])): ?>
      <p class="section-subtitle light"><?= e($content['services']['subtitle']) ?></p>
      <?php endif; ?>
    </div>
    <div class="services-grid">
      <?php foreach ($content['services']['items'] as $i => $service): ?>
      <article class="service-card" data-aos="fade-up" data-aos-delay="<?= $i * 80 ?>">
        <div class="service-icon" style="background-color:<?= e($service['color']) ?>20; color:<?= e($service['color']) ?>"><?= e($service['icon']) ?></div>
        <h3 class="service-title"><?= e($service['title']) ?></h3>
        <p class="service-text"><?= e($service['text']) ?></p>
        <div class="service-accent" style="background-color:<?= e($service['color']) ?>"></div>
      </article>
      <?php endforeach; ?>
    </div>
    <?php if (!empty($content['services']['show_link_button']) && !empty($content['services']['link_button_url'])): ?>
    <div class="section-cta" data-aos="fade-up">
      <a href="<?= e($content['services']['link_button_url']) ?>" class="btn btn-secondary">
        <?= e($content['services']['link_button_text']) ?>
      </a>
    </div>
    <?php endif; ?>
  </div>
</section>

<!-- =============== PORTFOLIO =============== -->
<section class="section section-portfolio" id="portfolio" aria-labelledby="portfolio-title"<?= bg($content['portfolio']['bg_color']) ?>>
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="section-eyebrow"><?= e($content['portfolio']['eyebrow']) ?></span>
      <h2 id="portfolio-title" class="section-title"><?= e($content['portfolio']['title']) ?></h2>
      <?php if (!empty($content['portfolio']['subtitle'])): ?>
      <p class="section-subtitle"><?= e($content['portfolio']['subtitle']) ?></p>
      <?php endif; ?>
    </div>
    <div class="portfolio-filter" role="tablist" aria-label="Filtrer par catégorie">
      <button class="filter-btn active" data-filter="all" role="tab" aria-selected="true">Tous</button>
      <?php
        $cats = array_unique(array_column($content['portfolio']['items'], 'category'));
        foreach ($cats as $cat):
      ?>
      <button class="filter-btn" data-filter="<?= e(strtolower($cat)) ?>" role="tab" aria-selected="false"><?= e($cat) ?></button>
      <?php endforeach; ?>
    </div>
    <div class="portfolio-grid" role="list">
      <?php foreach ($content['portfolio']['items'] as $i => $project): ?>
      <article class="portfolio-card" data-category="<?= e(strtolower($project['category'])) ?>" data-aos="fade-up" data-aos-delay="<?= $i * 60 ?>" role="listitem"
               itemscope itemtype="https://schema.org/CreativeWork">
        <div class="portfolio-img-wrap" style="background-color:<?= e($project['color']) ?>">
          <?php if (!empty($project['image'])): ?>
          <img src="<?= e($project['image']) ?>" alt="<?= e($project['title']) ?>" class="portfolio-img" itemprop="image" loading="lazy">
          <?php else: ?>
          <div class="portfolio-placeholder" aria-hidden="true">
            <span class="portfolio-placeholder-letter"><?= mb_substr($project['title'], 0, 1) ?></span>
          </div>
          <?php endif; ?>
          <div class="portfolio-overlay">
            <h3 class="portfolio-title" itemprop="name"><?= e($project['title']) ?></h3>
            <span class="portfolio-category" itemprop="genre"><?= e($project['category']) ?></span>
            <?php if (!empty($project['link'])): ?>
            <a href="<?= e($project['link']) ?>" class="portfolio-link" target="_blank" rel="noopener noreferrer" itemprop="url" aria-label="Voir le projet <?= e($project['title']) ?>">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <?php endif; ?>
          </div>
        </div>
      </article>
      <?php endforeach; ?>
    </div>
    <?php if (!empty($content['portfolio']['show_link_button']) && !empty($content['portfolio']['link_button_url'])): ?>
    <div class="section-cta" data-aos="fade-up">
      <a href="<?= e($content['portfolio']['link_button_url']) ?>" class="btn btn-primary">
        <?= e($content['portfolio']['link_button_text']) ?>
      </a>
    </div>
    <?php endif; ?>
  </div>
</section>

<!-- =============== PROCESS =============== -->
<section class="section section-process" id="process" aria-labelledby="process-title"<?= bg($content['process']['bg_color']) ?>>
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="section-eyebrow"><?= e($content['process']['eyebrow']) ?></span>
      <h2 id="process-title" class="section-title"><?= e($content['process']['title']) ?></h2>
      <?php if (!empty($content['process']['subtitle'])): ?>
      <p class="section-subtitle"><?= e($content['process']['subtitle']) ?></p>
      <?php endif; ?>
    </div>
    <div class="process-steps">
      <?php foreach ($content['process']['steps'] as $i => $step): ?>
      <div class="process-step" data-aos="fade-up" data-aos-delay="<?= $i * 100 ?>">
        <div class="step-number" aria-hidden="true"><?= e($step['number']) ?></div>
        <div class="step-content">
          <h3 class="step-title"><?= e($step['title']) ?></h3>
          <p class="step-text"><?= e($step['text']) ?></p>
        </div>
        <?php if ($i < count($content['process']['steps']) - 1): ?>
        <div class="step-connector" aria-hidden="true"></div>
        <?php endif; ?>
      </div>
      <?php endforeach; ?>
    </div>
    <?php if (!empty($content['process']['show_link_button']) && !empty($content['process']['link_button_url'])): ?>
    <div class="section-cta" data-aos="fade-up">
      <a href="<?= e($content['process']['link_button_url']) ?>" class="btn btn-primary">
        <?= e($content['process']['link_button_text']) ?>
      </a>
    </div>
    <?php endif; ?>
  </div>
</section>

<!-- =============== TESTIMONIALS =============== -->
<section class="section section-testimonials" id="testimonials" aria-labelledby="testimonials-title"<?= bg($content['testimonials']['bg_color']) ?>>
  <div class="container">
    <div class="section-header" data-aos="fade-up">
      <span class="section-eyebrow light"><?= e($content['testimonials']['eyebrow']) ?></span>
      <h2 id="testimonials-title" class="section-title light"><?= e($content['testimonials']['title']) ?></h2>
    </div>
    <div class="testimonials-grid">
      <?php foreach ($content['testimonials']['items'] as $i => $testi): ?>
      <blockquote class="testimonial-card" data-aos="fade-up" data-aos-delay="<?= $i * 100 ?>"
                  itemscope itemtype="https://schema.org/Review">
        <div class="quote-icon" aria-hidden="true">"</div>
        <p class="testimonial-quote" itemprop="reviewBody"><?= e($testi['quote']) ?></p>
        <footer class="testimonial-author" itemscope itemtype="https://schema.org/Person">
          <strong itemprop="name"><?= e($testi['author']) ?></strong>
          <span itemprop="jobTitle"><?= e($testi['role']) ?></span>
          <?php if (!empty($testi['company'])): ?>
          — <span itemprop="worksFor"><?= e($testi['company']) ?></span>
          <?php endif; ?>
        </footer>
      </blockquote>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- =============== CONTACT =============== -->
<section class="section section-contact" id="contact" aria-labelledby="contact-title"<?= bg($content['contact']['bg_color']) ?>>
  <div class="container">
    <div class="contact-wrapper">
      <div class="contact-info" data-aos="fade-right">
        <span class="section-eyebrow"><?= e($content['contact']['eyebrow']) ?></span>
        <h2 id="contact-title" class="section-title"><?= e($content['contact']['title']) ?></h2>
        <p class="section-text"><?= e($content['contact']['subtitle']) ?></p>
        <div class="contact-details">
          <?php if (!empty($content['contact']['email'])): ?>
          <a href="mailto:<?= e($content['contact']['email']) ?>" class="contact-link" itemprop="email">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <?= e($content['contact']['email']) ?>
          </a>
          <?php endif; ?>
          <?php if (!empty($content['contact']['phone'])): ?>
          <a href="tel:<?= e(preg_replace('/\s/', '', $content['contact']['phone'])) ?>" class="contact-link" itemprop="telephone">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <?= e($content['contact']['phone']) ?>
          </a>
          <?php endif; ?>
        </div>
        <div class="social-links" aria-label="Réseaux sociaux">
          <?php
          $socialIcons = [
            'instagram' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
            'behance'   => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-2.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/></svg>',
            'linkedin'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
            'dribbble'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>',
            'twitter'   => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.622 5.905-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>',
          ];
          foreach ($socialIcons as $key => $icon):
            if (!empty($social[$key])): ?>
          <a href="<?= e($social[$key]) ?>" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="<?= ucfirst($key) ?>">
            <?= $icon ?>
          </a>
          <?php endif; endforeach; ?>
        </div>
      </div>

      <div class="contact-form-wrap" data-aos="fade-left">
        <form class="contact-form" id="contact-form" novalidate aria-label="Formulaire de contact"
              itemscope itemtype="https://schema.org/ContactPage">
          <div class="form-group">
            <label for="contact-name" class="form-label">Nom complet <span aria-hidden="true">*</span></label>
            <input type="text" id="contact-name" name="from_name" class="form-input" required
                   autocomplete="name" aria-required="true" placeholder="Votre nom">
          </div>
          <div class="form-group">
            <label for="contact-email" class="form-label">Email <span aria-hidden="true">*</span></label>
            <input type="email" id="contact-email" name="from_email" class="form-input" required
                   autocomplete="email" aria-required="true" placeholder="votre@email.com">
          </div>
          <div class="form-group">
            <label for="contact-subject" class="form-label">Sujet</label>
            <input type="text" id="contact-subject" name="subject" class="form-input"
                   placeholder="Votre projet">
          </div>
          <div class="form-group">
            <label for="contact-message" class="form-label">Message <span aria-hidden="true">*</span></label>
            <textarea id="contact-message" name="message" class="form-input form-textarea" required
                      aria-required="true" placeholder="Décrivez votre projet..." rows="5"></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full" id="contact-submit">
            <span class="btn-text">Envoyer le message</span>
            <span class="btn-loading" aria-hidden="true" hidden>Envoi en cours...</span>
          </button>
          <div class="form-message" id="form-message" role="alert" aria-live="polite"></div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- =============== FOOTER =============== -->
<footer class="site-footer" role="contentinfo" itemscope itemtype="https://schema.org/WPFooter"<?= bg($content['footer']['bg_color']) ?>>
  <div class="footer-container">
    <div class="footer-brand">
      <a href="#top" class="footer-logo" aria-label="Retour en haut">
        <span class="logo-text"><?= e($site['logo_text'] ?: substr($site['name'], 0, 2)) ?></span>
      </a>
      <p class="footer-tagline"><?= e($site['tagline']) ?></p>
    </div>
    <div class="footer-social" aria-label="Réseaux sociaux">
      <?php foreach ($socialIcons as $key => $icon):
        if (!empty($social[$key])): ?>
      <a href="<?= e($social[$key]) ?>" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="<?= ucfirst($key) ?>">
        <?= $icon ?>
      </a>
      <?php endif; endforeach; ?>
    </div>
    <div class="footer-bottom">
      <p><?= e($content['footer']['text']) ?></p>
      <nav aria-label="Liens légaux">
        <?php foreach ($content['footer']['links'] as $link): ?>
        <a href="<?= e($link['href']) ?>" class="footer-legal-link"><?= e($link['label']) ?></a>
        <?php endforeach; ?>
        <?php if (!empty($cookies['tac_enabled'])): ?>
        <button onclick="tarteaucitron.userInterface.openPanel()" class="footer-legal-link footer-cookies-btn">Gérer les cookies</button>
        <?php endif; ?>
      </nav>
    </div>
  </div>
</footer>

<!-- Back to top -->
<button class="back-to-top" id="backToTop" aria-label="Retour en haut de page" title="Retour en haut">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
</button>

<!-- EmailJS -->
<?php if (!empty($emailjs['public_key'])): ?>
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script>emailjs.init("<?= e($emailjs['public_key']) ?>");</script>
<?php endif; ?>

<!-- Main script -->
<script>
  window.EMAILJS_CONFIG = {
    service_id:  "<?= e($emailjs['service_id']) ?>",
    template_id: "<?= e($emailjs['template_id']) ?>",
    public_key:  "<?= e($emailjs['public_key']) ?>"
  };
</script>
<script src="assets/js/main.js" defer></script>

<!-- Custom body tracking -->
<?php if (!empty($track['custom_body'])): ?>
<?= $track['custom_body'] . "\n" ?>
<?php endif; ?>

</body>
</html>
