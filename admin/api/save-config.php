<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (empty($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$configFile = dirname(dirname(__DIR__)) . '/data/config.json';
$current    = json_decode(file_get_contents($configFile), true);
$input      = json_decode(file_get_contents('php://input'), true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Données invalides']);
    exit;
}

/* Deep merge helper */
function deepMerge(array $base, array $override): array {
    foreach ($override as $key => $val) {
        if (is_array($val) && isset($base[$key]) && is_array($base[$key])) {
            $base[$key] = deepMerge($base[$key], $val);
        } else {
            $base[$key] = $val;
        }
    }
    return $base;
}

/* Sanitize color hex values */
function sanitizeColor(?string $c): string {
    if (!$c) return '';
    return preg_match('/^#[0-9a-fA-F]{3,8}$/', $c) ? $c : '';
}

/* Sanitize tracking IDs */
function sanitizeId(?string $s): string {
    return htmlspecialchars(trim($s ?? ''), ENT_QUOTES, 'UTF-8');
}

/* Validate and sanitize */
if (isset($input['colors'])) {
    foreach ($input['colors'] as $k => $v) {
        $input['colors'][$k] = sanitizeColor($v);
    }
}

if (isset($input['tracking'])) {
    foreach (['gtm_id','gtag_id','analytics_ua','analytics_ua_old','matomo_id','tiktok_id','facebook_pixel'] as $k) {
        if (isset($input['tracking'][$k])) {
            $input['tracking'][$k] = sanitizeId($input['tracking'][$k]);
        }
    }
}

$merged = deepMerge($current, $input);
$result = file_put_contents($configFile, json_encode($merged, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

if ($result === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Impossible d\'écrire le fichier de configuration']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Configuration sauvegardée']);
