<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// 1. Chemin vers le mode maintenance
if (file_exists($maintenance = __DIR__. '/../rachelle-v2/storage/framework/maintenance.php')) {
    require $maintenance;
}

// 2. Chemin vers l'autoloader de Composer
require __DIR__.'/../rachelle-v2/vendor/autoload.php';

// 3. Chemin vers le bootstrap de Laravel
/** @var Application $app */
$app = require_once __DIR__.'/../rachelle-v2/bootstrap/app.php';

$app->usePublicPath(__DIR__);

$app->handleRequest(Request::capture());