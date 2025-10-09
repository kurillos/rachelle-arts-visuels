<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\SocialiteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Carousel;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'carousels' => Carousel::all()->values(),
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

// Route pour le dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    

    Route::get('/admin', function () {
        return Inertia::render('Admin');
    })->name('admin');
    
    Route::get('/admin/carousels/create', function () {
        return Inertia::render('CreateCarousel');
    })->name('carousels.create');
});

require __DIR__.'/auth.php';
