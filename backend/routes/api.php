<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/hello', function () {
    return response()->json([
        'message' => 'Hello from Laravel API!',
        'version' => app()->version(),
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/user', fn(Request $r) => $r->user());
// });
