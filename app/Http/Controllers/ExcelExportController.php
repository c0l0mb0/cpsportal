<?php

namespace App\Http\Controllers;

use App\Export\ExelExportNormiZapasaKip;
use App\Export\ExelExportOtakaziRussianIzveshateli;
use App\Export\ExelExportPassport;
use App\Export\ExelExportPlanGrafic;
use App\Export\ExelExportPotrebnostMtr;

class ExcelExportController extends Controller

{
    public function exportNormiZapasaKip()
    {
        $normiZapasaKip = new ExelExportNormiZapasaKip('нормы_запаса_КИП.xlsx', 3, 1, null);
        $normiZapasaKip->run();
    }

    public function exportPotrebnostMtr()
    {
        $potrebnostMtr = new ExelExportPotrebnostMtr('потребности_МТР.xlsx', 1, 1, null);
        $potrebnostMtr->run();
    }

    public function exportPassport()
    {
        $passport = new ExelExportPassport('паспорт.xlsx', 1, 1, null);
        $passport->run();
    }

    public function exportPlanGraf()
    {
        $passport = new ExelExportPlanGrafic('план_график.xlsx', 1, 1, null);
        $passport->run();
    }

    public function exportOtkaziRussianIzveshatel()
    {
        $passport = new ExelExportOtakaziRussianIzveshateli('отказы извещателей.xlsx', 1, 1, null);
        $passport->run();
    }
}
