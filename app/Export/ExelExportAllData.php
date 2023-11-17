<?php

namespace App\Export;

use App\Http\Controllers\BuildEquipController;


class ExelExportAllData extends ExcelExport

{
    public function createHead()
    {
        $this->buildingsWithEquipment = BuildEquipController::getBuildingsWithEquipmentAllData();
        $fieldNames = array( 'affiliate', 'area' , 'group_1', 'group_2', 'shed', 'queue','fitt',
            'proj','fitt_year','proj_year','equip_master_type', 'type_aups','to_date','aud_warn_type', 'on_conserv',
            'quantity','measure','equip_year',
            'equip_name', 'kind_app_second','kind_app','to2_new','to2_new','brand_name','consist_proc','primary_sens','srok_slugby');
        $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames, false, null, null);
    }

    public function createBody()
    {

    }


    public function checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry): bool
    {
        return false;
    }
}
