<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Carousel;

/*
|--------------------------------------------------------------------------
| Routes Publiques (Accessibles par tous)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'carousels' => Carousel::all()->values(),
    ]);
})->name('welcome');

Route::get('/about', function () { return Inertia::render('About'); })->name('about');
Route::get('/services', function () { return Inertia::render('Services'); })->name('services');
Route::get('/portfolio', function () { return Inertia::render('Portfolio'); })->name('portfolio');
Route::get('/reviews', function () { return Inertia::render('Reviews'); })->name('reviews');

// Contact
Route::get('/contact', [ContactController::class, 'create'])->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

/*
|--------------------------------------------------------------------------
| Routes Sécurisées (Espace Administration)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    
    // Redirection automatique pour le lien par défaut de Laravel Breeze
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    });

    // Toutes les routes commençant par /admin/...
    Route::prefix('admin')->group(function () {
        
        // Accueil Admin
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        
        // Gestion du Carrousel (Vitrine)
        Route::get('/carousel', [AdminDashboardController::class, 'index'])->name('admin.carousel.index');
        Route::post('/carousel/upload', [AdminDashboardController::class, 'upload'])->name('admin.carousel.upload');
        Route::delete('/carousel/{id}', [AdminDashboardController::class, 'destroy'])->name('admin.carousel.destroy');

        // Gestion des Galeries Privées (Mariages & Shootings)
        Route::get('/galleries', [GalleryController::class, 'index'])->name('admin.galleries.index');
        Route::post('/galleries', [GalleryController::class, 'store'])->name('admin.galleries.store');
        Route::delete('/galleries/{gallery}', [GalleryController::class, 'destroy'])->name('admin.galleries.destroy');
    });

    /*
    | Gestion du Profil Utilisateur (Breeze)
    */
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';