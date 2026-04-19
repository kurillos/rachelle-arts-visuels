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
use App\Http\Controllers\Admin\WebProjectController;
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

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');
Route::get('/services', function () {
    return Inertia::render('Services');
})->name('services');
Route::get('/reviews', function () {
    return Inertia::render('Reviews');
})->name('reviews');

// Groupe Portfolio
Route::prefix('portfolio')->group(function () {
    Route::get('/', [PortfolioController::class, 'index'])->name('portfolio.index');
    Route::get('/{slug}', [PortfolioController::class, 'show'])->name('portfolio.show');
});

// Contact
Route::get('/contact', [ContactController::class, 'create'])->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

// ─────────────────────────────────────────────────────────────────────────────
// Routes Galerie Client
// ─────────────────────────────────────────────────────────────────────────────
Route::prefix('client/gallery')->group(function () {

    // 1. Inscription depuis le lien du mail
    Route::get('/{slug}/register', [ClientGalleryController::class, 'registerForm'])
        ->name('client.gallery.register');

    // ✅ CORRECTION : nom de méthode valide (pas de point) + méthode correcte (storeRegister)
    Route::post('/{slug}/register', [ClientGalleryController::class, 'storeRegister'])
        ->name('client.gallery.register.store');

    // 2. Affichage de la galerie (login ou galerie selon session)
    Route::get('/{slug}', [ClientGalleryController::class, 'show'])
        ->name('client.gallery.show');

    // 3. Connexion avec mot de passe
    Route::post('/{slug}/login', [ClientGalleryController::class, 'login'])
        ->name('client.gallery.login');

    // 4. Toggle favori (cœur)
    Route::post('/photo/{photo}/favorite', [ClientGalleryController::class, 'toggleFavorite'])
        ->name('client.gallery.favorite');

    // 5. Commentaire / note de retouche
    Route::post('/photo/{photo}/comment', [ClientGalleryController::class, 'updatePhotoComment'])
        ->name('client.gallery.photo.comment');

    // 6. Validation finale de la sélection
    Route::post('/{slug}/validate', [ClientGalleryController::class, 'validateSelection'])
        ->name('client.gallery.validate');
});

/*
|--------------------------------------------------------------------------
| Routes Sécurisées (Espace Administration)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    Route::prefix('admin')->group(function () {

        // Accueil Admin
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

        // Carrousel
        Route::get('/carousel', [AdminDashboardController::class, 'index'])->name('admin.carousel.index');
        Route::post('/carousel/upload', [AdminDashboardController::class, 'upload'])->name('admin.carousel.upload');
        Route::delete('/carousel/{id}', [AdminDashboardController::class, 'destroy'])->name('admin.carousel.destroy');

        // Galeries Privées
        Route::prefix('galleries')->name('admin.galleries.')->group(function () {
            Route::get('/', [GalleryController::class, 'index'])->name('index');
            Route::post('/', [GalleryController::class, 'store'])->name('store');
            Route::get('/{gallery}', [GalleryController::class, 'show'])->name('show');
            Route::delete('/{gallery}', [GalleryController::class, 'destroy'])->name('destroy');
            Route::post('/{gallery}/send-invitation', [GalleryController::class, 'sendInvitation'])->name('send');
            Route::post('/{gallery}/upload', [GalleryController::class, 'upload'])->name('upload');
        });

        // Catégories & Tags
        Route::get('/settings/categories-tags', [CategoryTagController::class, 'index'])->name('admin.settings.index');
        Route::post('/settings/categories', [CategoryTagController::class, 'storeCategory'])->name('admin.categories.store');
        Route::post('/settings/tags', [CategoryTagController::class, 'storeTag'])->name('admin.tags.store');
        Route::delete('/settings/categories/{category}', [CategoryTagController::class, 'destroyCategory'])->name('admin.categories.destroy');
        Route::delete('/settings/tags/{tag}', [CategoryTagController::class, 'destroyTag'])->name('admin.tags.destroy');
        Route::patch('/settings/categories/{category}', [CategoryTagController::class, 'updateCategory'])->name('admin.categories.update');
        Route::patch('/settings/tags/{tag}', [CategoryTagController::class, 'updateTag'])->name('admin.tags.update');

        // Portfolio Public
        Route::get('/portfolio', [PublicImageController::class, 'index'])->name('admin.portfolio.index');
        Route::post('/portfolio', [PublicImageController::class, 'store'])->name('admin.portfolio.store');
        Route::patch('/portfolio/{image}', [PublicImageController::class, 'update'])->name('admin.portfolio.update');
        Route::delete('/portfolio/{image}', [PublicImageController::class, 'destroy'])->name('admin.portfolio.destroy');

        // Portfolio Site Web
        Route::prefix('web-projects')->name('admin.web-projects.')->group(function () {
            Route::get('/', [WebProjectController::class, 'index'])->name('index');
            Route::post('/', [WebProjectController::class, 'store'])->name('store');
            Route::delete('/{project}', [WebProjectController::class, 'destroy'])->name('destroy');
        });

        // Offres
        Route::resource('offers', OfferController::class)
            ->names([
                'index'   => 'admin.offers.index',
                'store'   => 'admin.offers.store',
                'destroy' => 'admin.offers.destroy',
            ])
            ->except(['create', 'edit', 'show']);

        // Profil
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});

require __DIR__ . '/auth.php';
