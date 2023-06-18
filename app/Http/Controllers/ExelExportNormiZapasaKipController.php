<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BuildingsController;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use function PHPUnit\Framework\isNull;


class ExelExportNormiZapasaKipController extends Controller
{
    private $buildingsWithEequipment;
    private $affiliates;
    private $areas;
    private int $excelRowCursor;
    private int $excelColumnCursor;
    private $sheet;
    private string $fileName;
    private $spreadsheet;

    public function exportNormiZapasaKip()
    {
        $this->initiateParameters();
        $this->run();
    }

    private function initiateParameters()
    {
        $this->fileName = 'нормы_запаса_КИП.xlsx';
        $this->spreadsheet = new Spreadsheet();
        $this->sheet = $this->spreadsheet->getActiveSheet();
        $this->spreadsheet->getDefaultStyle()->getFont()->setName('Times New Roman');
        $this->spreadsheet->getDefaultStyle()->getFont()->setSize(12);
        $this->areas = ['ГП', 'Ямбург', 'Новый Уренгой'];
        $this->excelRowCursor = 3;
        $this->excelColumnCursor = 1;
    }

    public function run()
    {
        $rowsData = array('Наименование комплектуемого оборудования, объекта',
            'Оборудование', 'empty', 'ГОСТ ТУ ', 'Нормативная наработка на отказ, час'
        , 'Вероятность безотказной работы по ГОСТ k',
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
                $this->buildingsWithEequipment = BuildingsController::getBuildingsWithEquipmentGruppedWithSumWithCaseEquipName([['area', '=', $area], ['affiliate', '=', $affiliate->affiliate]]);
                $fieldNames = array('affiliate');
                $styleArray = [
                    'font' => [
                        'bold' => true,
                        'color' => ['argb' => 'FFFA0000'],
                    ],];
                $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames, true, null, $styleArray);

                $fieldNames = array('eqip_name_case', 'equip_name_extracted_brand', 'empty', 'custom|10000', 'custom|0.97'
                , 'custom|8760', 'quantity',
                    'custom|=IF(H&formulaRow<9,K&formulaRow+L&formulaRow+M&formulaRow,K&formulaRow+M&formulaRow)',
                    'custom|=ROUND(H&formulaRow*I&formulaRow,0)', 'custom|=1-F&formulaRow',
                     'custom|=1/2/H&formulaRow', 'custom|=2*SQRT(F&formulaRow*K&formulaRow/H&formulaRow)');
                $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames, false, null, null);
            }
        }

        $this->buildingsWithEequipment = cpsStuffController::index();
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
        $this->exportFile();
    }
    private function exportFile()
    {
        $writer = new Xlsx($this->spreadsheet);
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . urlencode($this->fileName) . '"');
        $writer->save('php://output');

        $this->spreadsheet->disconnectWorksheets();
        return "ok";
    }
    private function insertJustTextDataInRow($excelRowStart, $excelColumnStart, $rowsData, $workBookNumber, $styleArray)
    {
        foreach ($rowsData as $filedData) {
            if ($filedData == 'empty') {
                $this->excelColumnCursor++;
                continue;
            }
            $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $filedData);
            $this->excelColumnCursor++;
        }
        if (!is_null($styleArray)) {
            $range = $this->getLetterCoordinates($excelColumnStart, $excelRowStart, $excelColumnStart + count($rowsData) - 1, $excelRowStart);
            $this->sheet->getStyle($range)->applyFromArray($styleArray);
        }

        $this->excelColumnCursor = $excelColumnStart;
        $this->excelRowCursor++;
    }

    private function insertTableChunk($excelRowStart, $excelColumnStart, $fieldNames, $isOneEntry = false, $workBookNumber, $styleArray)
    {
        $this->excelRowCursor = $excelRowStart;
        $this->excelColumnCursor = $excelColumnStart;
        foreach ($this->buildingsWithEequipment as $buildingsWithEquipmentEntry) {
            foreach ($fieldNames as $fieldName) {
                if ($fieldName == 'empty') {
                    $this->excelColumnCursor++;
                    continue;
                }
                $fieldPipeSeparated = explode('|', $fieldName);

//                if ($fieldPipeSeparated[0] == 'custom' and !is_Null($fieldPipeSeparated[1]) and
//                    !($buildingsWithEquipmentEntry->is_accum) and $fieldPipeSeparated[1]==='=ROUND(H&formulaRow*I&formulaRow,0)') {
//                    $tmp = str_replace('&formulaRow',$this->excelRowCursor,$fieldPipeSeparated[1]);
//                    $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $tmp  );
//                    $this->excelColumnCursor++;
//                    continue;
//                }

                if($fieldPipeSeparated[0] == 'custom' and !is_Null($fieldPipeSeparated[1]) and
                    $buildingsWithEquipmentEntry->is_accum ==='TRUE'  and $fieldPipeSeparated[1]==='=ROUND(H&formulaRow*I&formulaRow,0)') {
                    $fieldPipeSeparated[1]='=IF(ROUND(H&formulaRow*0.18,0)<1,1,ROUND(H&formulaRow*0.18,0))';
                    $tmp = str_replace('&formulaRow',$this->excelRowCursor,$fieldPipeSeparated[1]);
                    $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $tmp);
                    $this->excelColumnCursor++;
                    continue;
                }

                if ($fieldPipeSeparated[0] == 'custom' and !is_Null($fieldPipeSeparated[1])) {
                    $tmp = str_replace('&formulaRow',$this->excelRowCursor,$fieldPipeSeparated[1]);
                    $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $tmp);
                    $this->excelColumnCursor++;
                    continue;
                }

                $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $buildingsWithEquipmentEntry->$fieldName);
                $this->excelColumnCursor++;

            }
            $this->excelColumnCursor = $excelColumnStart;
            $this->excelRowCursor++;
            if ($isOneEntry === true) {
                $range = $this->getLetterCoordinates($excelColumnStart, $excelRowStart, $excelColumnStart +count($fieldNames)-1, $excelRowStart);
                break;
            } else {
                $range = $this->getLetterCoordinates($excelColumnStart, $excelRowStart, $excelColumnStart +count($fieldNames)-1, count($this->buildingsWithEequipment));
            }
        }

        if (!is_null($styleArray)) {
            $this->sheet->getStyle($range)->applyFromArray($styleArray);
        }
    }

    private function getLetterCoordinates($excelColumnFirst, $excelRowFirst, $excelColumnLast, $excelRowLast,)
    {
        $excelColumnFirstLetter = $this->getNameFromNumber($excelColumnFirst);
        $excelColumnLastLetter = $this->getNameFromNumber($excelColumnLast);

        return $excelColumnFirstLetter . $excelRowFirst . ':' . $excelColumnLastLetter . $excelRowLast;
    }

    private function getNameFromNumber($num)
    {
        $numeric = ($num - 1) % 26;
        $letter = chr(65 + $numeric);
        $num2 = intval(($num - 1) / 26);
        if ($num2 > 0) {
            return $this->getNameFromNumber($num2) . $letter;
        } else {
            return $letter;
        }
    }

}
