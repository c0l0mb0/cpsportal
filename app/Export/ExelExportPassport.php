<?php

namespace App\Export;

use App\Http\Controllers\BuildEquipController;
use Exception;


class ExelExportPassport extends ExcelExport

{
    private $idBuilding;

    public function setIdBuilding($id)
    {
        $this->idBuilding = $id;
    }

    public function createHead()
    {
        $this->sheet->getPageSetup()->setFitToHeight(0);
        $this->sheet->getStyle('A10:G14')->getAlignment()->setWrapText(true);
        $this->sheet->getColumnDimension('A')->setWidth(12);
        $this->sheet->getColumnDimension('B')->setWidth(30);
        $this->sheet->getColumnDimension('C')->setWidth(12);
        $this->sheet->getColumnDimension('D')->setWidth(12);
        $this->sheet->getColumnDimension('E')->setWidth(11);
        $this->sheet->getColumnDimension('F')->setWidth(11);
        $this->sheet->getColumnDimension('G')->setWidth(25);

        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'Приложение №1, форма 3');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'РД 009-02-96');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);
        $this->excelRowCursor++;


        $styleArray = [
            'font' => [
                'bold' => true,
                'underline' => true,
                'size' => 14,
            ],];
        $this->sheet->mergeCells('A4:G4');
        $this->sheet->getStyle('A4:G4')
            ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('ПАСПОРТ СИСТЕМ ПОЖАРНОЙ АВТОМАТИКИ'), null, $styleArray);


        $this->excelRowCursor++;
        $styleArray = [
            'font' => [
                'bold' => true,
            ],];
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('1.Общие сведения'), null, $styleArray);
        $rowsData = array('Наименование предприятия Заказчика');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);


    }

    public function createBody()
    {
        $currentBuildingId = $this->idBuilding;


        $styleArray = [
            'font' => [
                'bold' => true,
                'underline' => true,
            ],];
        $this->sheet->mergeCells('A8:G8');
        $this->sheet->getStyle('A8:G8')
            ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $this->buildingsWithEquipment = BuildEquipController::getBuildingWithEquipmentByBuildingId([['buildings.id', '=', $currentBuildingId]]);

        $rowsData = array($this->getBuildingsWithEquipmentFieldValue('affiliate') . '   ООО "Газпром добыча Ямбург"');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

        $this->excelRowCursor++;

        $styleArray = [
            'font' => [
                'bold' => true,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],];
        $this->sheet->mergeCells('A10:B10');
        $this->sheet->mergeCells('E10:F10');
        $this->sheet->mergeCells('A11:B11');
        $this->sheet->mergeCells('E11:F11');
        $this->sheet->getRowDimension('10')->setRowHeight(92);
        $this->sheet->getStyle('A10:G11')
            ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $this->sheet->getStyle('A10:G11')
            ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $rowsData = array('Наименование защищаемого объекта', 'empty', 'Тип системы', 'Условный номер системы',
            'Наименование проектной организации, номер проекта, дата ', 'empty',
            'Наименование организации, выполнившей монтаж и наладку, дата сдачи в эксплуатация');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

        $buildingNameWithGroup = $this->getBuildingsWithEquipmentFieldValue('group_1') . " " .
            $this->getBuildingsWithEquipmentFieldValue('group_2') . " " .
            $this->getBuildingsWithEquipmentFieldValue('shed');
        $antiFireSystem = $this->getBuildingsWithEquipmentFieldValue('type_aups') . "  на базе прибора " .
            $this->getBuildingsWithEquipmentFieldValue('equip_master_type');
        $project = $this->getBuildingsWithEquipmentFieldValue('proj_year') . " " .
            $this->getBuildingsWithEquipmentFieldValue('proj');
        $fitting = $this->getBuildingsWithEquipmentFieldValue('fitt_year') . " " .
            $this->getBuildingsWithEquipmentFieldValue('fitt');
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],];

        $rowsData = array($buildingNameWithGroup, 'empty', $antiFireSystem, 'empty', $project, 'empty', $fitting);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);


        $symbolsCount = mb_strlen($this->sheet->getCell([3, 11])->getValue(), 'utf8');
        $rowWidth = $this->sheet->getColumnDimension('C')->getWidth() - 0.62;
        $rowHeight = $this->sheet->getRowDimension('11')->getRowHeight();
        $fontSize = $this->sheet->getStyle([3, 11])->getFont()->getSize();
        $textLength = $symbolsCount * ((-0.0136) * pow($fontSize, 2) + 0.6548 * $fontSize - 4.7184);
        $textLinesInCell = ceil($textLength / $rowWidth);
        $this->sheet->getRowDimension('11')->setRowHeight($textLinesInCell * 16);
//        throw new Exception($textLinesInCell);

        $this->excelRowCursor++;
        $this->sheet->mergeCells('A13:G13');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('2. Состав установки пожарной автоматики:'), null, null);

        $styleArray = [
            'font' => [
                'bold' => true,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],];
        $this->sheet->getRowDimension('14')->setRowHeight(80);
        $this->sheet->mergeCells('B14:D14');
        $this->sheet->getStyle('A14:G14')
            ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $this->sheet->getStyle('A14:G14')
            ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

        $rowsData = array('Условный номер системы', 'Наименование технических  средств системы',
            'empty', 'empty', 'Кол-во тех. средств в системе', 'Год выпуска',
            'Дата освидетельствования систем пожарной автоматики',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

//        ===============================================PassportEquipment==================================================
        $fieldNames = array('empty', 'equip_name', 'empty', 'empty', 'quantityWithMeasure', 'equip_year', 'empty', 'kind_signal');
        $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames, false, null, null);

        $rangePassportEquipment = str_replace('H', 'G', end($this->insertedDbChanksRangesArr));
        $firstLastRowArr = $this->getFirstAndLastRowFromFullExcelRange($rangePassportEquipment);
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],];
        $this->sheet->getStyle($rangePassportEquipment)->applyFromArray($styleArray);
        $this->sheet->getStyle($rangePassportEquipment)
            ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $this->sheet->getStyle($rangePassportEquipment)
            ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        for ($i = $firstLastRowArr[0]; $i <= $firstLastRowArr[1]; $i++) {
            $this->sheet->getRowDimension($i)->setRowHeight(26);
            $this->sheet->mergeCells('B' . $i . ':D' . $i);
            $this->sheet->getStyle('B' . $i . ':D' . $i)
                ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
        }

//        =================================================================================================================

        $this->buildingsWithEquipment = BuildEquipController::getBuildingChannelsByBuildingId([['buildings.id', '=', $currentBuildingId]]);

        $buildingOverAllSignals = 'Итого ';
        if ($this->getBuildingsWithEquipmentFieldValue('sum_ua') !== '0') {
            $buildingOverAllSignals = $buildingOverAllSignals .
                'УА-' . $this->getBuildingsWithEquipmentFieldValue('sum_ua') . ' ';
        }
        if ($this->getBuildingsWithEquipmentFieldValue('sum_iuc') !== '0') {
            $buildingOverAllSignals = $buildingOverAllSignals .
                'ИУЦ-' . $this->getBuildingsWithEquipmentFieldValue('sum_iuc') . ' ';
        }
        if ($this->getBuildingsWithEquipmentFieldValue('sum_ud') !== '0') {
            $buildingOverAllSignals = $buildingOverAllSignals .
                'УД-' . $this->getBuildingsWithEquipmentFieldValue('sum_ud') . ' ';
        }
        if ($this->getBuildingsWithEquipmentFieldValue('sum_id') !== '0') {
            $buildingOverAllSignals = $buildingOverAllSignals .
                'ИД-' . $this->getBuildingsWithEquipmentFieldValue('sum_id') . ' ';
        }
        if ($this->getBuildingsWithEquipmentFieldValue('sum_ia') !== '0') {
            $buildingOverAllSignals = $buildingOverAllSignals .
                'ИА-' . $this->getBuildingsWithEquipmentFieldValue('sum_ia') . ' ';
        }

        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('empty', 'empty', 'empty',
            'empty', 'empty', $buildingOverAllSignals), null, null);

        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('3. Условия технического обслуживания:'), null, [
                'font' => [
                    'bold' => true,
                ]]);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('Количество извещателей, устанавливаемых на высоте:'), null, null);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('от 5-ти до 8-ми метров                                       от 8-ми до 15-ти метров __________________'), null, null);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('свыше 15-ти метров ________________'), null, null);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('Наличие средств подъема на высоту_______________________________________________'), null, null);

        $this->sheet->getRowDimension($this->excelRowCursor)->setRowHeight(30);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('Категория защищаемых помещений по электробезопасности __________________________'), null, null);
        $this->sheet->getRowDimension($this->excelRowCursor)->setRowHeight(48);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('Другие сведения  ____________________________________________'), null, null);

        $this->sheet->setBreak([1, $this->excelRowCursor], \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet::BREAK_ROW);
        $this->excelRowCursor++;


        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':G' . $this->excelRowCursor);
        $styleArray = [
            'font' => [
                'bold' => true,
            ],];
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('4. Сведения о проведенных заменах технических средств системы АУПС'), null, $styleArray);

        $this->sheet->mergeCells('B' . $this->excelRowCursor . ':C' . $this->excelRowCursor);
        $this->sheet->mergeCells('D' . $this->excelRowCursor . ':E' . $this->excelRowCursor);
        $this->sheet->mergeCells('F' . $this->excelRowCursor . ':G' . $this->excelRowCursor);

        $styleArray = [
            'font' => [
                'bold' => true,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true, 'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,]];


        $rowsData = array('Условный номер системы', 'Наименование замененного технического средства, узла, элемента',
            'empty', 'Дата', 'empty',
            'Основание для замены', 'empty');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],];
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty');
        for ($i = 0; $i <= 51; $i++) {
            $this->sheet->mergeCells('B' . $this->excelRowCursor . ':C' . $this->excelRowCursor);
            $this->sheet->mergeCells('D' . $this->excelRowCursor . ':E' . $this->excelRowCursor);
            $this->sheet->mergeCells('F' . $this->excelRowCursor . ':G' . $this->excelRowCursor);
            $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

        }

        $rowsData = array('Паспорт составлен:', 'empty', 'empty', 'empty', 'Согласовано:');
        $styleArray = [
            'font' => [
                'bold' => true,
            ],];
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

        $this->excelRowCursor++;

        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':B' . $this->excelRowCursor);
        $this->sheet->mergeCells('E' . $this->excelRowCursor . ':G' . $this->excelRowCursor);

        $this->sheet->getStyle('A' . $this->excelRowCursor . ':B' . $this->excelRowCursor)->getBorders()
            ->getTop()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

        $this->sheet->getStyle('E' . $this->excelRowCursor . ':G' . $this->excelRowCursor)->getBorders()
            ->getTop()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

        $rowsData = array('(должность)', 'empty', 'empty', 'empty', '(должность)');
        $styleArray = [
            'font' => [
                'size' => 8,
            ],
            'alignment' => [
                'wrapText' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],];
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

        $this->excelRowCursor++;

        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':B' . $this->excelRowCursor);
        $this->sheet->mergeCells('E' . $this->excelRowCursor . ':G' . $this->excelRowCursor);

        $this->sheet->getStyle('A' . $this->excelRowCursor . ':B' . $this->excelRowCursor)->getBorders()
            ->getTop()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

        $this->sheet->getStyle('E' . $this->excelRowCursor . ':G' . $this->excelRowCursor)->getBorders()
            ->getTop()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
        $rowsData = array('(подпись, Ф.И.О.)', 'empty', 'empty', 'empty', '(подпись, Ф.И.О.)');

        $styleArray = [
            'font' => [
                'size' => 8,
            ],
            'alignment' => [
                'wrapText' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],];
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

        $this->excelRowCursor++;

        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':B' . $this->excelRowCursor);
        $this->sheet->mergeCells('E' . $this->excelRowCursor . ':G' . $this->excelRowCursor);

        $rowsData = array('"______"_________________ 20__ г.', 'empty', 'empty', 'empty', '"______"_________________ 20__ г.');
        $styleArray = [
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            ],];

        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);


        $this->sheet->getPageSetup()->setFitToPage(true);
        $this->sheet->getHighestRow();
        $this->sheet->getHighestColumn();
        $this->sheet->getPageSetup()->setPrintArea('A1:' . $this->sheet->getHighestColumn() . $this->sheet->getHighestRow());

    }


    public function checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry): bool
    {
        return false;
    }
}
