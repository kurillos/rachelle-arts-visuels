<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CarouselApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/carousels', [CarouselApiController::class, 'index']);
Route::post('/carousels', [CarouselApiController::class, 'store']);
Route::get('/carousels/{carousel}', [CarouselApiController::class, 'show']);
Route::put('/carousels/{carousel}', [CarouselApiController::class, 'update']);
Route::delete('/carousels/{carousel}', [CarouselApiController::class, 'destroy']);
