<?php

namespace App\Http\Controllers;

use App\Export\ExelExportActInvestigation;
use App\Export\ExelExportAllData;
use App\Export\ExelExportNormiZapasaKip;
use App\Export\ExelExportOtakaziRussianIzveshateli;
use App\Export\ExelExportPassport;
use App\Export\ExelExportPlanGraficV2;
use App\Export\ExelExportPotrebnostMtr;
use App\Export\ExelExportTepSeveralSheets;
use App\Export\ExelSpsBilet;
use Illuminate\Http\Request;
use Exception;

class ExcelExportController extends Controller

{
    public function exportNormiZapasaKip()
    {
        $normiZapasaKip = new ExelExportNormiZapasaKip('нормы_запаса_КИП.xlsx', 3, 1);
        $normiZapasaKip->run();
    }

    public function exportTep($id)
    {
        $buildingName = BuildingsController::getBuildingById($id);
        $exportTep = new ExelExportTepSeveralSheets('ТЭП_' . $buildingName . '.xlsx', 1, 1);
        $exportTep->setIdBuilding($id);
        $exportTep->run();
    }

    public function exportPotrebnostMtr()
    {
        $potrebnostMtr = new ExelExportPotrebnostMtr('потребности_МТР.xlsx', 1, 1);
        $potrebnostMtr->run();
    }

    public function exportPassport($id)
    {
//        $spsTest = new ExelSpsBilet('СПС вопросы.xlsx', 1, 1);
//        $spsTest->run();
        $buildingName = BuildingsController::getBuildingById($id);
        $passport = new ExelExportPassport('паспорт_' . $buildingName . '.xlsx', 1, 1);
        $passport->setIdBuilding($id);
        $passport->run();
    }

    public function exportSpsTest()
    {
        $spsTest = new ExelSpsBilet('СПС_вопросы.xlsx', 1, 1);
        $spsTest->run();
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
        $planGrafic = new ExelExportPlanGraficV2('план_график_' . $request->plan_graf_name . '.xlsx',
            12, 1, 'pl_gr.xlsx');
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

    public function exportActInvestigation(Request $request)
    {
        $this->validate($request, [
            'act_investigate_approve_fio' => 'required',
            'act_investigate_area' => 'required',
            'act_investigate_commission_memb_1' => 'required',
            'act_investigate_commission_memb_1_occupation' => 'nullable|string',
            'act_investigate_commission_memb_2' => 'required',
            'act_investigate_commission_memb_2_occupation' => 'nullable|string',
            'act_investigate_commission_memb_3' => 'required',
            'act_investigate_commission_memb_3_occupation' => 'nullable|string',
            'act_investigate_date' => 'required',
            'act_investigate_element_code' => 'required',
            'act_investigate_element_code_group' => 'required',
            'act_investigate_external_signs' => 'required',
            'act_investigate_fault_reason' => 'required',
            'act_investigate_fault_reason_group' => 'required',
            'act_investigate_fault_reason_tu' => 'required',
            'act_investigate_full_description' => 'required',
            'act_investigate_group_1' => 'required',
            'act_investigate_immediately_actions' => 'required',
            'act_investigate_prevent_actions' => 'required',
            'act_investigate_shed' => 'required',
            'act_investigate_short_description' => 'required',
            'act_investigate_time' => 'required',
            'act_investigate_date_issue' => 'required',
            'usage_hours' => 'required',
        ]);

        $actInvestigation = new ExelExportActInvestigation('акт_отказа.xlsx',
            'actInvestigation');
        $actInvestigation->setActParameters($request->act_investigate_approve_fio, $request->act_investigate_area,
            $request->act_investigate_commission_memb_1, $request->act_investigate_commission_memb_1_occupation,
            $request->act_investigate_commission_memb_2, $request->act_investigate_commission_memb_2_occupation,
            $request->act_investigate_commission_memb_3, $request->act_investigate_commission_memb_3_occupation,
            $request->act_investigate_date, $request->act_investigate_element_code,
            $request->act_investigate_element_code_group, $request->act_investigate_external_signs,
            $request->act_investigate_fault_reason, $request->act_investigate_fault_reason_group,
            $request->act_investigate_fault_reason_tu, $request->act_investigate_full_description,
            $request->act_investigate_group_1, $request->act_investigate_group_2,
            $request->act_investigate_immediately_actions, $request->act_investigate_prevent_actions,
            $request->act_investigate_shed, $request->act_investigate_short_description, $request->act_investigate_time,
            $request->act_investigate_date_issue, $request->usage_hours);
        $actInvestigation->run();
    }
}
