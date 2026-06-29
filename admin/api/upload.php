<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (empty($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$type    = $_POST['type'] ?? 'images'; // 'images' or 'videos'
$type    = in_array($type, ['images', 'videos']) ? $type : 'images';
$baseDir = dirname(dirname(__DIR__)) . '/uploads/' . $type . '/';
$baseUrl = '../uploads/' . $type . '/';

/* Delete action */
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' || ($_POST['action'] ?? '') === 'delete') {
    $filename = basename($_POST['file'] ?? '');
    $path     = $baseDir . $filename;
    if ($filename && file_exists($path) && is_file($path)) {
        unlink($path);
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Fichier introuvable']);
    }
    exit;
}

/* List action */
if (($_GET['action'] ?? '') === 'list') {
    $files = [];
    foreach (glob($baseDir . '*') as $f) {
        if (is_file($f) && basename($f) !== '.gitkeep') {
            $files[] = [
                'name'     => basename($f),
                'url'      => $baseUrl . basename($f),
                'size'     => filesize($f),
                'modified' => filemtime($f),
                'type'     => mime_content_type($f),
            ];
        }
    }
    usort($files, fn($a, $b) => $b['modified'] - $a['modified']);
    echo json_encode(['success' => true, 'files' => $files]);
    exit;
}

/* Upload action */
if (empty($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Aucun fichier reçu']);
    exit;
}

$file     = $_FILES['file'];
$maxSize  = 50 * 1024 * 1024; // 50MB

if ($file['error'] !== UPLOAD_ERR_OK) {
    $errors = [
        UPLOAD_ERR_INI_SIZE   => 'Fichier trop volumineux (limite serveur)',
        UPLOAD_ERR_FORM_SIZE  => 'Fichier trop volumineux (limite formulaire)',
        UPLOAD_ERR_PARTIAL    => 'Téléchargement partiel',
        UPLOAD_ERR_NO_FILE    => 'Aucun fichier',
        UPLOAD_ERR_NO_TMP_DIR => 'Dossier temporaire manquant',
        UPLOAD_ERR_CANT_WRITE => 'Impossible d\'écrire sur le disque',
    ];
    http_response_code(400);
    echo json_encode(['error' => $errors[$file['error']] ?? 'Erreur inconnue']);
    exit;
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Fichier trop volumineux (max 50MB)']);
    exit;
}

/* Allowed MIME types */
$allowedImages = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'];
$allowedVideos = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
$allowed = ($type === 'videos') ? $allowedVideos : $allowedImages;

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime  = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime, $allowed)) {
    http_response_code(400);
    echo json_encode(['error' => 'Type de fichier non autorisé: ' . $mime]);
    exit;
}

/* Sanitize filename */
$ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$basename = preg_replace('/[^a-z0-9_-]/i', '-', pathinfo($file['name'], PATHINFO_FILENAME));
$basename = strtolower(trim($basename, '-'));
$unique   = $basename . '-' . uniqid() . '.' . $ext;
$dest     = $baseDir . $unique;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    http_response_code(500);
    echo json_encode(['error' => 'Impossible de déplacer le fichier']);
    exit;
}

echo json_encode([
    'success' => true,
    'file'    => [
        'name' => $unique,
        'url'  => $baseUrl . $unique,
        'size' => filesize($dest),
        'type' => $mime,
    ],
]);
