<?php

use Illuminate\Support\Facades\Route;

// Health check for Render
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});

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
