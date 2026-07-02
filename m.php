<?php
/* Resolves a 5-char media shortcode (?id=Ab3k9, or pretty /m/Ab3k9 via .htaccess)
   to the real uploaded file and redirects the browser there. */

$id = preg_replace('/[^A-Za-z0-9]/', '', $_GET['id'] ?? '');

if (strlen($id) !== 5) {
    http_response_code(404);
    exit('Lien média invalide.');
}

$mediaIndexFile = __DIR__ . '/data/media.json';
$index = file_exists($mediaIndexFile) ? json_decode(file_get_contents($mediaIndexFile), true) : [];
$index = is_array($index) ? $index : [];

$entry = null;
foreach ($index as $item) {
    if (($item['id'] ?? '') === $id) { $entry = $item; break; }
}

if (!$entry || !in_array($entry['type'], ['images', 'videos'], true)) {
    http_response_code(404);
    exit('Média introuvable.');
}

$filename = basename($entry['file']);
$path     = __DIR__ . '/uploads/' . $entry['type'] . '/' . $filename;

if (!is_file($path)) {
    http_response_code(404);
    exit('Fichier introuvable.');
}

header('Location: /uploads/' . $entry['type'] . '/' . rawurlencode($filename), true, 302);
exit;
