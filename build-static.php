<?php
/**
 * Script de build statique — génère le site pour GitHub Pages
 * Usage : php build-static.php
 */

$projectRoot = __DIR__;
$outputDir   = $projectRoot . '/dist';

echo "=== Build statique pour GitHub Pages ===\n\n";

// Clean output dir
if (is_dir($outputDir)) {
    rrmdir($outputDir);
}
mkdir($outputDir, 0755, true);
mkdir($outputDir . '/assets/css', 0755, true);
mkdir($outputDir . '/assets/js',  0755, true);
mkdir($outputDir . '/assets/images', 0755, true);
mkdir($outputDir . '/uploads/images', 0755, true);
mkdir($outputDir . '/uploads/videos', 0755, true);

// 1. Render index.php -> index.html
echo "1. Rendu de index.php...\n";
ob_start();
$_SERVER['REQUEST_URI']  = '/';
$_SERVER['HTTP_HOST']    = 'localhost';
$_SERVER['REQUEST_METHOD'] = 'GET';
include $projectRoot . '/index.php';
$html = ob_get_clean();

// Replace .php links with .html (none expected, but just in case)
$html = str_replace('href="admin/', 'data-admin="admin/', $html);

file_put_contents($outputDir . '/index.html', $html);
echo "   ✓ dist/index.html (" . strlen($html) . " bytes)\n";

// 2. Copy CSS
echo "2. Copie des assets CSS...\n";
copy($projectRoot . '/assets/css/style.css', $outputDir . '/assets/css/style.css');
echo "   ✓ dist/assets/css/style.css\n";

// 3. Copy JS
echo "3. Copie des assets JS...\n";
copy($projectRoot . '/assets/js/main.js', $outputDir . '/assets/js/main.js');
echo "   ✓ dist/assets/js/main.js\n";

// 4. Copy uploaded images (if any)
echo "4. Copie des médias...\n";
$copied = copyDir($projectRoot . '/uploads/images', $outputDir . '/uploads/images', ['jpg','jpeg','png','gif','webp','svg','avif']);
$copiedVid = copyDir($projectRoot . '/uploads/videos', $outputDir . '/uploads/videos', ['mp4','webm','ogg']);
echo "   ✓ $copied image(s), $copiedVid vidéo(s)\n";

// 5. Copy site images
copyDir($projectRoot . '/assets/images', $outputDir . '/assets/images', ['jpg','jpeg','png','gif','webp','svg','avif','ico']);

// 6. .nojekyll — disable Jekyll processing on GitHub Pages
file_put_contents($outputDir . '/.nojekyll', '');
echo "5. ✓ .nojekyll créé\n";

// 7. 404 page
$notFoundHtml = <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page non trouvée</title>
  <link rel="stylesheet" href="/assets/css/style.css">
  <style>
    :root { --color-primary:#013336; --color-secondary:#56b578; --color-light:#e0d5c4; --color-accent:#9e9a87; --color-bg-body:#faf8f5; }
    .error-page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; background: var(--color-primary); color: var(--color-light); }
    .error-code { font-family: serif; font-size: 8rem; font-weight: 900; color: var(--color-secondary); line-height: 1; }
    h1 { font-family: serif; font-size: 2rem; margin: 1rem 0 0.5rem; }
    p  { opacity: .7; margin-bottom: 2rem; }
  </style>
</head>
<body>
  <div class="error-page">
    <div class="error-code">404</div>
    <h1>Page introuvable</h1>
    <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
    <a href="/" class="btn btn-primary" style="display:inline-flex;align-items:center;padding:.875rem 2rem;background:#56b578;color:#013336;border-radius:9999px;font-weight:700;text-decoration:none">Retour à l'accueil</a>
  </div>
</body>
</html>
HTML;
file_put_contents($outputDir . '/404.html', $notFoundHtml);
echo "6. ✓ 404.html créé\n";

// 8. CNAME (optionnel — décommentez et renseignez votre domaine)
// file_put_contents($outputDir . '/CNAME', 'votredomaine.fr');

echo "\n=== Build terminé ! ===\n";
echo "Fichiers dans : dist/\n";
echo "Prêt pour GitHub Pages.\n\n";
echo "Commandes suivantes :\n";
echo "  git checkout gh-pages\n";
echo "  xcopy /E /Y dist\\* .\n";
echo "  git add -A && git commit -m 'deploy: update GitHub Pages'\n";
echo "  git push origin gh-pages\n";

/* ---- Helpers ---- */
function rrmdir(string $dir): void {
    if (!is_dir($dir)) return;
    foreach (scandir($dir) as $f) {
        if ($f === '.' || $f === '..') continue;
        $p = $dir . DIRECTORY_SEPARATOR . $f;
        is_dir($p) ? rrmdir($p) : unlink($p);
    }
    rmdir($dir);
}

function copyDir(string $src, string $dst, array $allowedExts = []): int {
    $count = 0;
    if (!is_dir($src)) return 0;
    if (!is_dir($dst)) mkdir($dst, 0755, true);
    foreach (glob($src . '/*') as $file) {
        if (!is_file($file)) continue;
        if ($allowedExts) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (!in_array($ext, $allowedExts)) continue;
        }
        copy($file, $dst . '/' . basename($file));
        $count++;
    }
    return $count;
}
