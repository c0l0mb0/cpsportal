<?php

use App\Http\Controllers\BuildEquipController;
use App\Http\Controllers\BuildingsController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExcelExportController;
use App\Http\Controllers\UserConrtroller;
use App\Http\Controllers\WarehouseRemainsController;
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
    Route::get('exam_table', [ExamController::class, 'index']);

    Route::get('warehouse-remains-all', [WarehouseRemainsController::class, 'index']);
    Route::post('import-excel-warehouse-remains', [WarehouseRemainsController::class, 'importExcelWarehouseRemains']);

    Route::get('workers-all', [WorkersController::class, 'index']);
    Route::get('export-all-next-workers-checks-json', [WorkersController::class, 'export']);
    Route::put('workers/{id}', [WorkersController::class, 'update']);

    Route::get('buildings-all', [BuildingsController::class, 'index']);
    Route::get('buildings-and-orederedplangraf', [BuildingsController::class, 'getBuildingsAndPlanGrafDataOrderedByPlanGraf']);
    Route::get('buildings-group1', [BuildingsController::class, 'indexGroup1']);
    Route::get('buildings-group2', [BuildingsController::class, 'indexGroup2']);
    Route::get('buildings-plangraf', [BuildingsController::class, 'indexPlanGraf']);
    Route::get('buildings-affiliate', [BuildingsController::class, 'indexAffiliate']);
    Route::get('buildings-plangraf-by-id/{id}', [BuildingsController::class, 'getBuildingPlanGrafById']);
    Route::post('buildings', [BuildingsController::class, 'create']);
    Route::put('buildings/{id}', [BuildingsController::class, 'update']);
    Route::put('update-buildingplangraf-seq', [BuildingsController::class, 'updateBuildingSequenceOfPlanGraf']);
    Route::delete('buildings/{id}', [BuildingsController::class, 'destroy']);

    Route::get('equipment-all', [EquipmentController::class, 'index']);
    Route::post('equipment', [EquipmentController::class, 'create']);
    Route::put('equipment/{id}', [EquipmentController::class, 'update']);
    Route::delete('equipment/{id}', [EquipmentController::class, 'destroy']);

    Route::get('equipment-buildings/{id}', [BuildEquipController::class, 'index']);
    Route::post('equipment-buildings', [BuildEquipController::class, 'create']);
    Route::put('equipment-buildings/{id}', [BuildEquipController::class, 'update']);
    Route::delete('equipment-buildings/{id}', [BuildEquipController::class, 'destroy']);
    Route::get('equipment-usage/{id}', [BuildEquipController::class, 'getBuildingsWhereEquipmentItemIsUsed']);
    Route::post('copy-equip-to-build', [BuildEquipController::class, 'copyEquipmentFromFromOneBuildingToAnother']);
    Route::post('delete-equip-duplicates', [BuildEquipController::class, 'deleteEquipmentDuplicates']);


    Route::get('export-normi-zapasa-kip', [ExcelExportController::class, 'exportNormiZapasaKip']);
    Route::get('export-all-data', [ExcelExportController::class, 'exportAllData']);
    Route::get('export-potrebnost-mtr', [ExcelExportController::class, 'exportPotrebnostMtr']);
    Route::get('export-passport/{id}', [ExcelExportController::class, 'exportPassport']);
    Route::post('export-plangrafic', [ExcelExportController::class, 'exportPlanGraf']);
    Route::get('export-otkazi-russianizveshateli', [ExcelExportController::class, 'exportOtkaziRussianIzveshatel']);
    Route::get('export-tep/{id}', [ExcelExportController::class, 'exportTep']);

    Route::get('get-user-roles', [UserConrtroller::class, 'indexUserRoles']);



});
