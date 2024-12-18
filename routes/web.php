<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('auth.login');
});
Route::get('/test', function () {
    return view('cps_test');
})->middleware(['auth', 'verified'])->name('test');

Route::get('/warehouse', function () {
    return view('cps_warehouse');
})->middleware(['auth', 'verified'])->name('warehouse');

Route::get('/cpsportal', function () {
    return view('cps_portal_table');
})->middleware(['auth', 'verified'])->name('cpsportal');

require __DIR__ . '/auth.php';
