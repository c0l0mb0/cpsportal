<?php

namespace App\Http\Controllers;

use App\Export\ExelExportAllData;
use App\Export\ExelExportNormiZapasaKip;
use App\Export\ExelExportOtakaziRussianIzveshateli;
use App\Export\ExelExportPassport;
use App\Export\ExelExportPlanGrafic;
use App\Export\ExelExportPotrebnostMtr;
use Illuminate\Http\Request;

class ExcelExportController extends Controller

{
    public function exportNormiZapasaKip()
    {
        $normiZapasaKip = new ExelExportNormiZapasaKip('нормы_запаса_КИП.xlsx', 3, 1);
        $normiZapasaKip->run();
    }

    public function exportPotrebnostMtr()
    {
        $potrebnostMtr = new ExelExportPotrebnostMtr('потребности_МТР.xlsx', 1, 1);
        $potrebnostMtr->run();
    }

    public function exportPassport($id)
    {
        $buildingName = BuildingsController::getBuildingById($id);
        $passport = new ExelExportPassport('паспорт_' . $buildingName . '.xlsx', 1, 1);
        $passport->setIdBuilding($id);
        $passport->run();
    }

    public function exportAllData()
    {
        $allCpsData = new ExelExportAllData('все_данные.xlsx', 1, 1);
        $allCpsData->run();
    }

    public function exportPlanGraf(Request $request)
    {
        $this->validate($request, [
            'plan_graf_name' => 'required',
            'year_pl_gr' => 'required',
            'who_approve_fio' => 'required',
            'who_approve_position' => 'required',
            'who_assign_fio' => 'required',
            'who_assign_position' => 'required',
        ]);

        $planGrafic = new ExelExportPlanGrafic('план_график_' . $request->plan_graf_name . '.xlsx',
            1, 1,);
        $planGrafic->setPlanGrafWorkBookAndSheet($request->plan_graf_name, $request->year_pl_gr,
            $request->who_approve_fio, $request->who_approve_position, $request->who_assign_fio,
            $request->who_assign_position,);
        $planGrafic->run();
    }

    public function exportOtkaziRussianIzveshatel()
    {
        $passport = new ExelExportOtakaziRussianIzveshateli('отказы извещателей.xlsx', 1, 1);
        $passport->run();
    }
}
