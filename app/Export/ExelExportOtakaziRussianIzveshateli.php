<?php

namespace App\Export;

use App\Http\Controllers\BuildEquipController;
use App\Export;
use App\Http\Controllers\BuildingsController;
use App\Http\Controllers\cpsStuffController;


class ExelExportOtakaziRussianIzveshateli extends ExcelExport
{
    public function createHead()
    {
        $this->sheet->getColumnDimension('A')->setWidth(30);
        $this->sheet->getColumnDimension('B')->setWidth(30);
        $this->sheet->getColumnDimension('C')->setWidth(30);
        $this->sheet->getColumnDimension('D')->setWidth(30);
        $this->sheet->getColumnDimension('E')->setWidth(30);
        $this->sheet->getColumnDimension('F')->setWidth(30);
        $this->sheet->getColumnDimension('G')->setWidth(30);
        $this->sheet->getColumnDimension('H')->setWidth(30);
        $this->sheet->getColumnDimension('I')->setWidth(30);
        $this->sheet->getColumnDimension('J')->setWidth(30);
        $this->sheet->getColumnDimension('K')->setWidth(30);
        $this->sheet->getColumnDimension('L')->setWidth(30);
        $this->sheet->getColumnDimension('M')->setWidth(30);
        $this->sheet->getColumnDimension('N')->setWidth(30);
        $this->sheet->getColumnDimension('O')->setWidth(30);
        $this->sheet->getColumnDimension('P')->setWidth(30);
        $this->sheet->getColumnDimension('Q')->setWidth(30);
    }

    public function createBody()
    {
            $this->buildingsWithEquipment = BuildEquipController::getIzveshatelEquipmentCount();
//        throw new Exception();
        $fieldNames = array('eqip_name_case', 'equip_name_extracted_brand', 'brand_name', 'quantity');
        $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames, false, null, null);
    }

    public function checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry): bool
    {
        return false;
    }


}
