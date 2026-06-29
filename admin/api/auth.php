<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$authFile = dirname(dirname(__DIR__)) . '/data/auth.json';

switch ($action) {
    case 'logout':
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }
        session_destroy();
        echo json_encode(['success' => true]);
        break;

    case 'change_password':
        if (empty($_SESSION['admin_logged_in'])) { http_response_code(401); echo json_encode(['error' => 'Non autorisé']); exit; }
        $auth        = json_decode(file_get_contents($authFile), true);
        $current     = $_POST['current_password'] ?? '';
        $newPwd      = $_POST['new_password'] ?? '';
        $confirmPwd  = $_POST['confirm_password'] ?? '';

        if (!password_verify($current, $auth['password_hash'])) {
            echo json_encode(['error' => 'Mot de passe actuel incorrect']); exit;
        }
        if (strlen($newPwd) < 8) {
            echo json_encode(['error' => 'Le nouveau mot de passe doit contenir au moins 8 caractères']); exit;
        }
        if ($newPwd !== $confirmPwd) {
            echo json_encode(['error' => 'Les mots de passe ne correspondent pas']); exit;
        }

        $auth['password_hash'] = password_hash($newPwd, PASSWORD_BCRYPT);
        file_put_contents($authFile, json_encode($auth, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo json_encode(['success' => true, 'message' => 'Mot de passe modifié avec succès']);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Action inconnue']);
}
