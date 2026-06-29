<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (empty($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$contentFile = dirname(dirname(__DIR__)) . '/data/content.json';
$current     = json_decode(file_get_contents($contentFile), true);
$input       = json_decode(file_get_contents('php://input'), true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Données invalides']);
    exit;
}

function deepMergeContent(array $base, array $override): array {
    foreach ($override as $key => $val) {
        if (is_array($val) && isset($base[$key]) && is_array($base[$key])) {
            $base[$key] = deepMergeContent($base[$key], $val);
        } else {
            $base[$key] = $val;
        }
    }
    return $base;
}

$merged = deepMergeContent($current, $input);
$result = file_put_contents($contentFile, json_encode($merged, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

if ($result === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Impossible d\'écrire le fichier de contenu']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Contenu sauvegardé']);
