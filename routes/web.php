<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\CarouselController;
use App\Http\Controllers\ImageController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'user' => Auth::user(),
    ]);
});

Route::get('/images/{filename}', [ImageController::class, 'show'])->name('get.image');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('carousels', CarouselController::class);

Route::get('/upload-form', [ImageController::class, 'showUploadForm'])->name('upload.form');

// Routes pour la barre de navigation
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/services', function () {
    return Inertia::render('Services');
})->name('services');

Route::get('/portfolio', function () {
    return Inertia::render('Portfolio');
})->name('portfolio');

Route::get('/reviews', function () {
    return Inertia::render('Reviews');
})->name('reviews');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');


require __DIR__.'/auth.php';