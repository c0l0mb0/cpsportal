<?php

namespace App\Http\Controllers;

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
        $normiZapasaKip = new ExelExportNormiZapasaKip('нормы_запаса_КИП.xlsx', 3, 1 );
        $normiZapasaKip->run();
    }

    public function exportPotrebnostMtr()
    {
        $potrebnostMtr = new ExelExportPotrebnostMtr('потребности_МТР.xlsx', 1, 1 );
        $potrebnostMtr->run();
    }

    public function exportPassport($id)
    {
        $buildingName = BuildingsController::getBuildingById($id);
        $passport = new ExelExportPassport('паспорт_' . $buildingName . '.xlsx', 1, 1);
        $passport->setIdBuilding($id);
        $passport->run();
    }

    public function exportPlanGraf(Request $request)
    {
        $this->validate($request, [
            'plan_graf_name' => 'required'
        ]);

        $planGrafic = new ExelExportPlanGrafic('план_график_' . $request->plan_graf_name .'.xlsx',
            1, 1, );
        $planGrafic->setPlanGrafWorkBookAndSheet($request->plan_graf_name);
        $planGrafic->run();
    }

    public function exportOtkaziRussianIzveshatel()
    {
        $passport = new ExelExportOtakaziRussianIzveshateli('отказы извещателей.xlsx', 1, 1 );
        $passport->run();
    }
}
