<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ClientGalleryController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\CategoryTagController;
use App\Http\Controllers\Admin\PublicImageController;
use App\Http\Controllers\Admin\OfferController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Carousel;

/*
|--------------------------------------------------------------------------
| Routes Publiques
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'carousels' => Carousel::all()->values(),
    ]);
})->name('welcome');

Route::get('/about', function () { return Inertia::render('About'); })->name('about');
Route::get('/services', function () { return Inertia::render('Services'); })->name('services');
Route::get('/reviews', function () { return Inertia::render('Reviews'); })->name('reviews');

// Groupe Portfolio Propre
Route::prefix('portfolio')->group(function () {
    // URL: /portfolio (Tout voir)
    Route::get('/', [PortfolioController::class, 'index'])->name('portfolio.index');
    
    // URL: /portfolio/photographie (Voir un métier)
    Route::get('/{slug}', [PortfolioController::class, 'show'])->name('portfolio.show');
});

// Contact
Route::get('/contact', [ContactController::class, 'create'])->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

// Routes publiques pour les clients de Rachelle
Route::prefix('client/gallery')->group(function () {
    // La vue de connexion ou la galerie (selon la session)
    Route::get('/{slug}', [ClientGalleryController::class, 'show'])->name('client.gallery.show');
    
    // Le traitement du mot de passe
    Route::post('/{slug}/login', [ClientGalleryController::class, 'login'])->name('client.gallery.login');
    
    // Action de favoris (Post-authentification client)
    Route::post('/photo/{photo}/favorite', [ClientGalleryController::class, 'toggleFavorite'])->name('client.gallery.favorite');
});

// Routes publiques pour les clients
Route::prefix('client/gallery')->group(function () {
    // 1. Inscription (Lien du mail)
    Route::get('/{slug}/register', [ClientGalleryController::class, 'registerForm'])->name('client.gallery.register');
    Route::post('/{slug}/register', [ClientGalleryController::class, 'register.store'])->name('client.gallery.register.store');

    // 2. Connexion classique
    Route::get('/{slug}', [ClientGalleryController::class, 'show'])->name('client.gallery.show');
    Route::post('/{slug}/login', [ClientGalleryController::class, 'login'])->name('client.gallery.login');
    
    // 3. Actions (Favoris)
    Route::post('/photo/{photo}/favorite', [ClientGalleryController::class, 'toggleFavorite'])->name('client.gallery.favorite');

    // 4. Commentaires 
    Route::post('/photo/{photo}/comment', [ClientGalleryController::class, 'updatePhotoComment'])->name('client.gallery.photo.comment');

    // 5. Validation de la sélection finale (Action finale du client)
    Route::post('/{slug}/validate', [ClientGalleryController::class, 'validateSelection'])->name('client.gallery.validate');
});

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
        Route::prefix('galleries')->name('admin.galleries.')->group(function () {
            Route::get('/', [GalleryController::class, 'index'])->name('index');
            Route::post('/', [GalleryController::class, 'store'])->name('store');
            Route::get('/{gallery}', [GalleryController::class, 'show'])->name('show');
            Route::delete('/{gallery}', [GalleryController::class, 'destroy'])->name('destroy');
            Route::post('/{gallery}/send-invitation', [GalleryController::class, 'sendInvitation'])->name('send');
        });

        // Gestion des Catégories & Tags
        Route::get('/settings/categories-tags', [CategoryTagController::class, 'index'])->name('admin.settings.index');
        Route::post('/settings/categories', [CategoryTagController::class, 'storeCategory'])->name('admin.categories.store');
        Route::post('/settings/tags', [CategoryTagController::class, 'storeTag'])->name('admin.tags.store');
        Route::delete('/settings/categories/{category}', [CategoryTagController::class, 'destroyCategory'])->name('admin.categories.destroy');
        Route::delete('/settings/tags/{tag}', [CategoryTagController::class, 'destroyTag'])->name('admin.tags.destroy');
        Route::patch('/settings/categories/{category}', [CategoryTagController::class, 'updateCategory'])->name('admin.categories.update');
        Route::patch('/settings/tags/{tag}', [CategoryTagController::class, 'updateTag'])->name('admin.tags.update');


        // Portfolio Public (Gérer les images visibles sur le site)
        Route::get('/portfolio', [PublicImageController::class, 'index'])->name('admin.portfolio.index');   
        Route::post('/portfolio', [PublicImageController::class, 'store'])->name('admin.portfolio.store');
        Route::delete('/portfolio/{image}', [PublicImageController::class, 'destroy'])->name('admin.portfolio.destroy');

        // Admin Offres (Gérer les offres de services)
        Route::resource('offers', OfferController::class)
            ->names([
                    'index' => 'admin.offers.index',
                    'store' => 'admin.offers.store',
                    'destroy' => 'admin.offers.destroy',
                ])
            ->except(['create', 'edit', 'show']);

        /*
        | Gestion du Profil Utilisateur (Breeze)
        */
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});

require __DIR__.'/auth.php';