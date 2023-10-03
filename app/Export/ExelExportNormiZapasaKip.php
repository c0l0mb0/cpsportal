<?php

namespace App\Export;

use App\Http\Controllers\BuildEquipController;
use App\Export;
use App\Http\Controllers\BuildingsController;
use App\Http\Controllers\cpsStuffController;


class ExelExportNormiZapasaKip extends ExcelExport
{
    public function createHead()
    {
        $rowsData = array('Наименование комплектуемого оборудования, объекта',
            'Оборудование', 'empty', 'ГОСТ ТУ ', 'Нормативная наработка на отказ, час',
            'Вероятность безотказной работы по ГОСТ k',
            'Фактический годовой фонд времени работы оборудования, час',
            'Парк комплектующего оборудования на начало текущего года, Np, шт',
            'Норма страхового запаса, %', 'Величина страхового запаса, шт.', 'Расчетные параметры');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $rowsData = array('empty',
            'Наименование', 'Тип, марка ', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'Среднее значение вероятности выхода из строя U', 'Расчетный параметр 1/2n',
            'Расчетный параметр BaV(k*U/n)');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $rowsData = array('1', '2', '3', '4', '5',
            '6', '7', '8', '9', '10', '11', '12', '13',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);
        //hat styles
        $this->sheet->getColumnDimension('A')->setWidth(12);
        $this->sheet->getColumnDimension('B')->setWidth(70);
        $this->sheet->getColumnDimension('C')->setWidth(30);
        $this->sheet->getColumnDimension('D')->setWidth(12);
        $this->sheet->getColumnDimension('E')->setWidth(12);
        $this->sheet->getColumnDimension('F')->setWidth(12);
        $this->sheet->getColumnDimension('G')->setWidth(12);
        $this->sheet->getColumnDimension('H')->setWidth(12);
        $this->sheet->getColumnDimension('I')->setWidth(12);
        $this->sheet->getColumnDimension('J')->setWidth(12);
        $this->sheet->getRowDimension('3')->setRowHeight(95);
        $this->sheet->getRowDimension('4')->setRowHeight(95);

        $this->sheet->getStyle('A3')->getAlignment()->setTextRotation(90);
        $this->sheet->getStyle('D3:J3')->getAlignment()->setTextRotation(90);
        $this->sheet->getStyle('K4:M4')->getAlignment()->setTextRotation(90);

        $this->sheet->mergeCells('A3:A4');
        $this->sheet->getStyle('A3:M5')
            ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $this->sheet->getStyle('A3:M5')
            ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $this->sheet->getStyle('A3:M4')->getAlignment()->setWrapText(true);

        $this->sheet->mergeCells('B3:C3');
        $this->sheet->mergeCells('D3:D4');
        $this->sheet->mergeCells('E3:E4');
        $this->sheet->mergeCells('F3:F4');
        $this->sheet->mergeCells('G3:G4');
        $this->sheet->mergeCells('H3:H4');
        $this->sheet->mergeCells('I3:I4');
        $this->sheet->mergeCells('J3:J4');

        $this->sheet->mergeCells('K3:M3');
        $this->sheet->mergeCells('K3:M3');

        $this->excelRowCursor = 6;
        $this->excelColumnCursor = 2;

        $this->sheet->getStyle('A3:M5')->getBorders()
            ->getAllBorders()
            ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
    }

    public function createBody()
    {
        foreach ($this->areas as $area) {

            $rowsData = array($area);
            $styleArray = [
                'font' => [
                    'bold' => true,
                    'color' => ['argb' => 'FFAA0000'],
                ],];
            $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

            $this->affiliates = BuildingsController::getAffiliates([['area', '=', $area]]);
            foreach ($this->affiliates as $affiliate) {
                $this->buildingsWithEquipment = BuildEquipController::getBuildingsWithEquipmentGruppedWithSumWithCaseEquipName([['area', '=', $area], ['affiliate', '=', $affiliate->affiliate]]);
                $fieldNames = array('affiliate');
                $styleArray = [
                    'font' => [
                        'bold' => true,
                        'color' => ['argb' => 'FFFA0000'],
                    ],];
                $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames, true, null, $styleArray);

                $fieldNames = array('eqip_name_case', 'equip_name_extracted_brand', 'empty', 'custom|100000', 'custom|0.97'
                , 'custom|8760', 'quantity',
                    'custom|=IF(H&formulaRow<9,K&formulaRow+L&formulaRow+M&formulaRow,K&formulaRow+M&formulaRow)',
                    'custom|=ROUND(H&formulaRow*I&formulaRow,0)', 'custom|=1-F&formulaRow',
                    'custom|=1/2/H&formulaRow', 'custom|=2*SQRT(F&formulaRow*K&formulaRow/H&formulaRow)');
                $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames, false, null, null);
            }
        }
        $this->buildingsWithEquipment = cpsStuffController::index();
        $styleArray = [
            'font' => [
                'bold' => true,
                'color' => ['argb' => 'FFFA0000'],
            ],];
        $rowsData = array('Ямбург');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);
        $styleArray = [
            'font' => [
                'bold' => true,
                'color' => ['argb' => 'FFFA0000'],
            ],];
        $rowsData = array('УАиМО');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);
        $fieldNames = array('stuff_name', 'empty', 'empty', 'custom|10000', 'custom|0.97'
        , 'custom|8760', 'quantity',
            'custom|=IF(H&formulaRow<9,K&formulaRow+L&formulaRow+M&formulaRow,K&formulaRow+M&formulaRow)',
            'custom|=ROUND(H&formulaRow*I&formulaRow,0)', 'custom|=1-F&formulaRow',
            'custom|=1/2/H&formulaRow', 'custom|=2*SQRT(F&formulaRow*K&formulaRow/H&formulaRow)');
        $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames, false, null, null);
    }

    public function checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry): bool
    {
        if ($fieldPipeSeparated[0] == 'custom' and !is_Null($fieldPipeSeparated[1]) and
            $buildingsWithEquipmentEntry->is_accum === 'TRUE' and $fieldPipeSeparated[1] === '=ROUND(H&formulaRow*I&formulaRow,0)') {
            $fieldPipeSeparated[1] = '=IF(ROUND(H&formulaRow*0.18,0)<1,1,ROUND(H&formulaRow*0.18,0))';
            $tmp = str_replace('&formulaRow', $this->excelRowCursor, $fieldPipeSeparated[1]);
            $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $tmp);
            $this->excelColumnCursor++;
            return true;
        }
        if ($fieldPipeSeparated[0] == 'custom' and isset($buildingsWithEquipmentEntry->life_time_max) and
            $fieldPipeSeparated[1] === '10000') {
            if(!is_Null($buildingsWithEquipmentEntry->life_time_max) ) {
                $tmp = intval($buildingsWithEquipmentEntry->life_time_max)*730;
                $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $tmp);
                $this->excelColumnCursor++;
                return true;
            }

        }
        return false;
    }
}
