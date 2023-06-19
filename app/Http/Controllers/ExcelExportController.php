<?php

namespace App\Http\Controllers;

use App\Export\ExelExportNormiZapasaKip;

class ExcelExportController extends Controller

{
    public function exportNormiZapasaKip()
    {
        $normiZapasaKip = new ExelExportNormiZapasaKip();
        $normiZapasaKip->run();
    }

    public function exportPotrebnostMtr()
    {
        $potrebnostMtr = new ExelExportNormiZapasaKip();
        $potrebnostMtr->run();
    }
}
