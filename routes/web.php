<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\SocialiteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Carousel;
use Illuminate\Support\Facades\Auth;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'carousels' => Carousel::all()->values(),
        'auth' => [
            'user' => Auth::user() ? [
                'name' => Auth::user()->name,
            ] : null,
        ],
    ]);
})->name('welcome');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/services', function () {
    return Inertia::render('Services');
})->name('services');

Route::get('/portfolio', function () {
    return Inertia::render('Portfolio');
})->name('portfolio');

Route::get('/contact', [ContactController::class, 'create'])->name('contact');

Route::get('/reviews', function () {
    return Inertia::render('Reviews');
})->name('reviews');

Route::get('/signup', [RegisterController::class, 'create'])
    ->middleware('guest')
    ->name('signup');

Route::post('/signup', [RegisterController::class, 'store'])
    ->middleware('guest')
    ->name('signup.store');

Route::get('/contact', [ContactController::class, 'create'])->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

Route::prefix('auth')->group(function () {
    // Routes pour l'authentification via des fournisseurs externes (SSO)
    Route::get('{provider}/redirect', [SocialiteController::class, 'redirect'])->name('socialite.redirect');
    // Gére la réponse du fournisseur externe
    Route::get('{provider}/callback', [SocialiteController::class, 'callback'])->name('socialite.callback');
});



require __DIR__.'/auth.php';