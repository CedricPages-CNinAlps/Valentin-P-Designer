<?php
session_start();
if (!empty($_SESSION['admin_logged_in'])) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $authFile = dirname(__DIR__) . '/data/auth.json';
    $auth     = json_decode(file_get_contents($authFile), true);
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username === ($auth['username'] ?? 'admin') && password_verify($password, $auth['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_user']      = $username;
        $_SESSION['admin_ip']        = $_SERVER['REMOTE_ADDR'];
        header('Location: dashboard.php');
        exit;
    }
    sleep(1); // brute-force mitigation
    $error = 'Identifiants incorrects.';
}

$config = json_decode(file_get_contents(dirname(__DIR__) . '/data/config.json'), true);
$colors = $config['colors'];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connexion — Back Office</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="stylesheet" href="assets/css/admin.css">
  <style>
    :root {
      --color-primary:   <?= htmlspecialchars($colors['primary']) ?>;
      --color-secondary: <?= htmlspecialchars($colors['secondary']) ?>;
      --color-light:     <?= htmlspecialchars($colors['light']) ?>;
      --color-accent:    <?= htmlspecialchars($colors['accent']) ?>;
    }
  </style>
</head>
<body class="admin-login-page">
  <main class="login-wrapper">
    <div class="login-card">
      <div class="login-logo">
        <span class="logo-text admin-logo-text"><?= htmlspecialchars($config['site']['logo_text'] ?: 'VP') ?></span>
      </div>
      <h1 class="login-title">Back Office</h1>
      <p class="login-subtitle">Connexion sécurisée à l'espace d'administration</p>

      <?php if ($error): ?>
      <div class="admin-alert admin-alert-error" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <?= htmlspecialchars($error) ?>
      </div>
      <?php endif; ?>

      <form method="POST" action="" class="login-form" novalidate>
        <div class="admin-form-group">
          <label for="username" class="admin-label">Identifiant</label>
          <input type="text" id="username" name="username" class="admin-input"
                 required autocomplete="username" placeholder="admin" autofocus>
        </div>
        <div class="admin-form-group">
          <label for="password" class="admin-label">Mot de passe</label>
          <div class="password-wrap">
            <input type="password" id="password" name="password" class="admin-input"
                   required autocomplete="current-password" placeholder="••••••••">
            <button type="button" class="toggle-pwd" aria-label="Afficher le mot de passe" data-target="password">
              <svg class="eye-show" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg class="eye-hide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" hidden><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>
        <button type="submit" class="admin-btn admin-btn-primary admin-btn-full">
          Se connecter
        </button>
      </form>

      <a href="../" class="login-back-link">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        Retour au site
      </a>
    </div>
  </main>

  <script>
    document.querySelectorAll('.toggle-pwd').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        const show  = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.querySelector('.eye-show').hidden = show;
        btn.querySelector('.eye-hide').hidden = !show;
        btn.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
      });
    });
  </script>
</body>
</html>
