<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('main');
});

Route::post('/detect-video', [App\Http\Controllers\DetectController::class, 'detectVideo']);

Route::get('/main', [App\Http\Controllers\MainController::class, 'index'])->name('dashboard');
Route::get('/medical-operation', [App\Http\Controllers\MedicalController::class, 'index'])->name('medical.operation');
Route::get('/construction-operation', [App\Http\Controllers\ConstructionController::class, 'index'])->name('construction.operation');
