<?php

use App\Http\Controllers\BuildEquipController;
use App\Http\Controllers\BuildingsController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\ExcelExportController;
use App\Http\Controllers\UserConrtroller;
use App\Http\Controllers\WorkersController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function(){
    Route::get('workersall', [WorkersController::class, 'index']);
    Route::post('workers', [WorkersController::class, 'create']);
    Route::put('workers/{id}', [WorkersController::class, 'update']);
    Route::post('workers-add-six-month', [WorkersController::class, 'addSixMonthFromLastDateToNextDate']);
    Route::delete('workers/{id}', [WorkersController::class, 'destroy']);

    Route::get('cps-buildings-all', [BuildingsController::class, 'index']);
    Route::get('cps-buildings-and-orederedplangraf', [BuildingsController::class, 'getBuildingsAndPlanGrafDataOrderedByPlanGraf']);
    Route::get('cps-buildings-group1', [BuildingsController::class, 'indexGroup1']);
    Route::get('cps-buildings-group2', [BuildingsController::class, 'indexGroup2']);
    Route::get('cps-buildings-plangraf', [BuildingsController::class, 'indexPlanGraf']);
    Route::get('cps-buildings-affiliate', [BuildingsController::class, 'indexAffiliate']);
    Route::get('cps-buildings-plangraf-by-id/{id}', [BuildingsController::class, 'getBuildingPlanGrafById']);
    Route::post('cps-buildings', [BuildingsController::class, 'create']);
    Route::put('cps-buildings/{id}', [BuildingsController::class, 'update']);
    Route::put('cps-update-buildingplangraf-seq', [BuildingsController::class, 'updateBuildingSequenceOfPlanGraf']);
    Route::delete('cps-buildings/{id}', [BuildingsController::class, 'destroy']);

    Route::get('cps-equipment-all', [EquipmentController::class, 'index']);
    Route::post('cps-equipment', [EquipmentController::class, 'create']);
    Route::put('cps-equipment/{id}', [EquipmentController::class, 'update']);
    Route::delete('cps-equipment/{id}', [EquipmentController::class, 'destroy']);

    Route::get('cps-equipment-buildings/{id}', [BuildEquipController::class, 'index']);
    Route::post('cps-equipment-buildings', [BuildEquipController::class, 'create']);
    Route::put('cps-equipment-buildings/{id}', [BuildEquipController::class, 'update']);
    Route::delete('cps-equipment-buildings/{id}', [BuildEquipController::class, 'destroy']);
    Route::get('cps-equipment-usage/{id}', [BuildEquipController::class, 'getBuildingsWhereEquipmentItemIsUsed']);


    Route::get('export-normi-zapasa-kip', [ExcelExportController::class, 'exportNormiZapasaKip']);
    Route::get('export-all-data', [ExcelExportController::class, 'exportAllData']);
    Route::get('export-potrebnost-mtr', [ExcelExportController::class, 'exportPotrebnostMtr']);
    Route::get('export-passport/{id}', [ExcelExportController::class, 'exportPassport']);
    Route::post('export-plangrafic', [ExcelExportController::class, 'exportPlanGraf']);
    Route::get('export-otkazi-russianizveshateli', [ExcelExportController::class, 'exportOtkaziRussianIzveshatel']);

    Route::get('get-user-roles', [UserConrtroller::class, 'indexUserRoles']);



});
