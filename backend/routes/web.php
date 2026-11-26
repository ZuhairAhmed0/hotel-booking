<?php

use Illuminate\Support\Facades\Route;

// Health check for Render
Route::get('/health', function () {
    return response('OK', 200)->header('Content-Type', 'text/plain');
})->withoutMiddleware([
    \Illuminate\Cookie\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
    \Illuminate\View\Middleware\ShareErrorsFromSession::class,
]);

// Clean frontend routes
Route::get('/', function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }
    return view('welcome');
});

Route::get('/hotels', function () {
    $path = public_path('Hotels.html');
    if (file_exists($path)) {
        return response()->file($path);
    }
    return redirect('/');
});

Route::get('/hotel', function () {
    $path = public_path('hotel.html');
    if (file_exists($path)) {
        return response()->file($path);
    }
    return redirect('/');
});
