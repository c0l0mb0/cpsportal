<?php

namespace App\Export;

use App\Http\Controllers\BuildEquipController;
use App\Http\Controllers\BuildingsController;
use Exception;


class ExelExportPlanGraficV2 extends ExcelExport
{
    private int $listSize = 1600;//1404
    private int $listUsedHeight = 0;
    private int $listHeaderHeight = 40;
    private int $itrEquipHeight = 35;
    private int $buildingNameRowHeight = 55;
    private int $buildingSignsRowHeight = 130;
    private int $buildingEngineerSystemRowHeight = 100;
    private int $buildingSoundSystemRowHeight = 100;
    private int $equipItemHeight = 16;

    private string $planGrafName;
    private string $yearPlGr;
    private string $whoApproveFio;
    private string $whoApprovePosition;
    private string $whoAssignFio;
    private string $whoAssignPosition;
    private array $arrEquipmentInBuildingFirstLastRow = [];

    public function setPlanGrafWorkBookAndSheet($planGrafName, $yearPlGr, $whoApproveFio, $whoApprovePosition,
                                                $whoAssignFio, $whoAssignPosition)
    {
        $this->planGrafName = $planGrafName;
        $this->yearPlGr = $yearPlGr;
        $this->whoApproveFio = $whoApproveFio;
        $this->whoApprovePosition = $whoApprovePosition;
        $this->whoAssignFio = $whoAssignFio;
        $this->whoAssignPosition = $whoAssignPosition;
        $this->planGrafBuildings = BuildingsController::getBuildingsOfPlanGrafic([
            ['plan_graf_name', '=', $this->planGrafName]]);
    }

    public function createHead()
    {
        $this->spreadsheet->getDefaultStyle()->getFont()->setSize(13);
        $this->sheet->getPageMargins()->setTop(0.25)->setRight(0.25)->setLeft(1.0)
            ->setBottom(0.25);
        $this->sheet->getPageSetup()
            ->setOrientation(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::ORIENTATION_LANDSCAPE);
        $this->sheet->getPageSetup()
            ->setPaperSize(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::PAPERSIZE_A3);

        $this->sheet->setCellValue('L7', $this->whoApprovePosition);
        $this->sheet->setCellValue('L8', $this->whoApproveFio);

        $signYear = $this->sheet->getCell('L9')->getValue();
        $this->sheet->setCellValue('L9', str_replace('&year', $this->yearPlGr, $signYear));


        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('на объекте ' .
            $this->planGrafName . ' филиала УА и МО на ' . $this->yearPlGr .
            ' год.'), null, null);

        $this->excelRowCursor++;

        $this->insertNewPageHeader($this->excelRowCursor);
    }


    public function createBody()
    {
        foreach ($this->planGrafBuildings as $planGrafBuilding) {
            $this->buildingsWithEquipment = BuildEquipController::getBuildingWithEquipmentByBuildingId([['buildings.id', '=', $planGrafBuilding->id]]);
            $this->insertBuildingData($planGrafBuilding);
        }
        $this->setItrEquipHeight();
        $this->createBottom();
        $this->divideToLists();

    }

    private function divideToLists()
    {
        $this->listUsedHeight = 0;
        $currentExcelRow = 0;
        $lastExcelRow = $this->sheet->getHighestRow();
        $watchDog = 0;
        $page = 1;

        while ($currentExcelRow < $lastExcelRow) {
            $watchDog++;
            if ($watchDog == 10000) {
                break;
            }

            $rowHeight = $this->sheet->getRowDimension($currentExcelRow)->getRowHeight();
            $this->listUsedHeight += $rowHeight;

            if ($this->listUsedHeight > $this->listSize) {


                $buildingIndexOnPageBreak = $this->findBuildingInArrByRowNumber($currentExcelRow);
                $buildingOnPageBreakStartRow = $this->arrEquipmentInBuildingFirstLastRow[$buildingIndexOnPageBreak][0];
                $buildingOnPageBreakEquipmentAmount = $this->arrEquipmentInBuildingFirstLastRow[$buildingIndexOnPageBreak][1] -
                    $this->arrEquipmentInBuildingFirstLastRow[$buildingIndexOnPageBreak][0] - 3;


                $buildingOnPageBreak_RowsBeforePageEnd = $currentExcelRow -
                    $this->arrEquipmentInBuildingFirstLastRow[$buildingIndexOnPageBreak][0];

                $buildingOnPageBreak_RowsAfterPageEnd =
                    $this->arrEquipmentInBuildingFirstLastRow[$buildingIndexOnPageBreak][1] - $currentExcelRow;


                if ($buildingOnPageBreakEquipmentAmount < 5) { //if building small, then break. Very rare condition
                    $this->insertPageBreakWithPageHeader($buildingOnPageBreakStartRow, $buildingIndexOnPageBreak, true);
                    $currentExcelRow = $buildingOnPageBreakStartRow - 1;
                    $page++;
                    continue;
                }
                // considering previous if clause, we have a big building (more than or equal 5 equipment items)
                if ($buildingOnPageBreak_RowsBeforePageEnd < 4) { //0- 3  building's rows  fit on the page, rest rows on next page
                    $this->insertPageBreakWithPageHeader($buildingOnPageBreakStartRow, $buildingIndexOnPageBreak, true);
                    $currentExcelRow = $buildingOnPageBreakStartRow - 1;
                    $page++;
                    continue;
                }
                // almost whole building fits on page, but 0-4 building's rows on next page. 0 means that only part of one row on next page
                if (0 <= $buildingOnPageBreak_RowsAfterPageEnd && $buildingOnPageBreak_RowsAfterPageEnd <= 5) {

                    $this->insertPageBreakWithPageHeader($this->arrEquipmentInBuildingFirstLastRow[$buildingIndexOnPageBreak][1] - 3, $buildingIndexOnPageBreak, false);
                    $currentExcelRow = $this->arrEquipmentInBuildingFirstLastRow[$buildingIndexOnPageBreak][1] - 4;
                    $page++;
                    continue;
                }
                //the rest case is big building with page break in a middle
                $this->insertPageBreakWithPageHeader($currentExcelRow, $buildingIndexOnPageBreak, false);
                $page++;
            }
            $currentExcelRow++;
        }
        $this->sheet->getPageSetup()->setPrintArea('A1:' . 'P' . $this->sheet->getHighestRow());
    }

    private function insertPageBreakWithPageHeader($pageBreakWithPageHeaderRow, $buildingIndexOnPageBreak, bool $isPageBreakAboveBuilding)
    {
        try {
            $this->sheet->insertNewRowBefore($pageBreakWithPageHeaderRow);
        } catch (Exception $e) {
            echo 'Caught exception: ', $e->getMessage(), "\n";
        }
        $this->insertNewPageHeader($pageBreakWithPageHeaderRow);
        $this->eachArrEquipmentInBuildingPlusOne($buildingIndexOnPageBreak, $isPageBreakAboveBuilding);
        $this->sheet->setBreak([1, $pageBreakWithPageHeaderRow - 1], \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet::BREAK_ROW);
        $this->listUsedHeight = 0;
    }

    private function eachArrEquipmentInBuildingPlusOne($indexBuildingWithPageBreak, $isPageBreakAboveBuilding)
    {
        foreach ($this->arrEquipmentInBuildingFirstLastRow as $index => &$equipmentInBuildingFirstLastRow) {
            if ($index >= $indexBuildingWithPageBreak) {
                $equipmentInBuildingFirstLastRow[1] = $equipmentInBuildingFirstLastRow[1] + 1;

                if ($index === $indexBuildingWithPageBreak && $isPageBreakAboveBuilding === false) {
                    continue;
                }
                $equipmentInBuildingFirstLastRow[0] = $equipmentInBuildingFirstLastRow[0] + 1;
            }
        }
    }

    private function findBuildingInArrByRowNumber($row): int
    {
        foreach ($this->arrEquipmentInBuildingFirstLastRow as $index => $equipmentInBuildingFirstLastRow) {
            if ($row <= $equipmentInBuildingFirstLastRow[1] and $row >= $equipmentInBuildingFirstLastRow[0]) {
                return $index;
            }
        }
        return 0;
    }

    private function createBottom()
    {
        $this->excelRowCursor++;
        $this->sheet->getStyle([2, $this->excelRowCursor])->getFill()
            ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
            ->getStartColor()->setARGB('D3D3D3');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('empty', 'empty', ' - проведение профилактических работ (испытаний) на оборудовании, согласно "Перечня работ", утвержденного Главным инженером ООО "Газпром добыча Ямбург" 26.05.2016г. (с утв. изменениями)'), null, null);
        $this->excelRowCursor++;

        $this->sheet->getStyle([2, $this->excelRowCursor])->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUMDASHED);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('empty', 'empty', '  - проведение испытаний согласно "Перечня работ", утвержденного Главным инженером ООО "Газпром добыча Ямбург" 26.05.2016г. (с утв. изменениями)'), null, null);
        $this->excelRowCursor++;

        $this->sheet->mergeCells('B' . $this->excelRowCursor . ':O' . $this->excelRowCursor);

        $styleArray = [
            'alignment' => [
                'wrapText' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
            'height' => 120,
        ];
        $text = <<<EOT
         Примечание:
         1. Комплексные испытания на работоспособность проводятся с периодичностью один раз в год, но не более 15 месяцев между испытаниями (ГОСТ Р 59638-2021) ;
         2. Испытания системы оповещения и управления эвакуацией проводятся с периодичностью два раза в год, но не более 7 месяцев между проверками (ГОСТ Р 59639-2021) ;
         3. На ГПА и МКУ, находящихся в работе, ежемесячное ТО проводится в объеме внешнего осмотра;
         4. Комплексные испытания на работоспособность и испытания систем оповещения и управления эвакуацией на газовых промыслах проводятся в соответсвии с План-графиком ППР ф. ГПУ и НГДУ.
         EOT;
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('empty', $text), null, $styleArray);
        $this->excelRowCursor++;


        $styleArray = [
            'font' => [
                'bold' => true,
            ],
        ];
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('empty', $this->whoAssignPosition, 'empty', 'empty', 'empty', $this->whoAssignFio,), null, $styleArray);
        $this->sheet->mergeCells('B' . $this->excelRowCursor - 1 . ':D' . $this->excelRowCursor - 1);
    }

    public function setItrEquipHeight()
    {
        for ($i = 1; $i <= $this->sheet->getHighestRow(); $i++) {
            $cellValue = $this->sheet->getCell([1, $i])->getValue();
            if (str_contains($cellValue, ' (на план . останове . Указать дату, ФИО, подпись ИТР проводящего ТО)')) {
                $this->sheet->getRowDimension($i)->setRowHeight($this->itrEquipHeight);
                $this->sheet->getStyle([1, $i])->getAlignment()->setWrapText(true);
            }
        }
    }

    public function insertBuildingData($planGrafBuilding, $amountOfEquipmentRowsFittedOnSheet = null)
    {
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'C1E1C1',
                ],
            ],
            'height' => $this->buildingNameRowHeight
        ];
        $rowBuildingStart = $this->excelRowCursor;
        $buildingNameAndTOdate = 'Здание ' . $this->getBuildingsWithEquipmentFieldValue('shed') .
            ' дата ТО - ' . $this->getBuildingsWithEquipmentFieldValue('to_date');
        $rowsData = array($buildingNameAndTOdate, 'empty', 'empty', 'empty', 'Дата', 'Дата', 'Дата',
            'Дата', 'Дата', 'Дата', 'Дата', 'Дата', 'Дата', 'Дата', 'Дата', 'Дата',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

        $range = $this->getLetterCoordinates(5, $this->excelRowCursor - 1, 17, $this->excelRowCursor - 1);
        $this->sheet->getStyle($range)->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP);

        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'height' => $this->equipItemHeight];

        $fieldNames = array('equip_name', 'quantity | centered', 'measure | centered', 'to2_new | centered',
            'cel_january | centered', 'cel_february | centered', 'cel_march | centered',
            'cel_april | centered', 'cel_may | centered', 'cel_june | centered', 'cel_july | centered', 'cel_august | centered',
            'cel_september | centered', 'cel_october | centered', 'cel_november | centered', 'cel_december | centered');
        $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames,
            null, $styleArray, $amountOfEquipmentRowsFittedOnSheet, false);

        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'alignment' => [
                'wrapText' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
        ];
        $this->sheet->getRowDimension($this->excelRowCursor)->setRowHeight($this->buildingSignsRowHeight);
        $rowsData = array('Исполнитель работ(Ф . И . О . подпись)', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

        $this->sheet->getRowDimension($this->excelRowCursor)->setRowHeight($this->buildingEngineerSystemRowHeight);


        $rowsData = array('comprehensiveTesting', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);
        $this->sheet->getStyle('E' . $this->excelRowCursor - 1 . ':P' . $this->excelRowCursor - 1)->getBorders()->getOutline()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUMDASHED);


        $this->sheet->getRowDimension($this->excelRowCursor)->setRowHeight($this->buildingSoundSystemRowHeight);
        $rowsData = array('alertAndEvacuation', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);
        $this->sheet->getStyle('E' . $this->excelRowCursor - 1 . ':P' . $this->excelRowCursor - 1)->getBorders()->getOutline()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUMDASHED);

        $rowBuildingEnd = $this->excelRowCursor;
        array_push($this->arrEquipmentInBuildingFirstLastRow, [$rowBuildingStart, $rowBuildingEnd - 1]);
    }

    public function insertJustTextDataInRow($excelRowStart, $excelColumnStart, $rowsData, $workBookNumber, $styleArray)
    {
        $comprehensiveTesting = 'Комплексные испытания на работоспособность с выполнением алгоритмов взаимодействия систем пожарной сигнализации с системами противопожарной защиты и инженерными системами';
        $alertAndEvacuation = 'Испытания системы оповещения и управления эвакуацией';
        $this->excelColumnCursor = $excelColumnStart;
        $this->excelRowCursor = $excelRowStart;
        foreach ($rowsData as $filedData) {
            if ($filedData == 'empty') {
                $this->excelColumnCursor++;
                continue;
            }
            if ($filedData == 'comprehensiveTesting') {
                $this->addActBoldtext($comprehensiveTesting);
                $this->excelColumnCursor++;
                continue;
            }
            if ($filedData == 'alertAndEvacuation') {
                $this->addActBoldtext($alertAndEvacuation);
                $this->excelColumnCursor++;
                continue;
            }
            $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $filedData);
            $this->excelColumnCursor++;
        }
        if (!is_null($styleArray)) {
            $range = $this->getLetterCoordinates($excelColumnStart, $excelRowStart, $excelColumnStart + count($rowsData) - 1, $excelRowStart);

            foreach ($styleArray as $styleEntry => $styleValue) {
                if ($styleEntry === "height") {
                    $this->sheet->getRowDimension($excelRowStart)->setRowHeight($styleValue);
                }
            }
            $this->sheet->getStyle($range)->applyFromArray($styleArray);
        }

        $this->excelColumnCursor = $excelColumnStart;
        $this->excelRowCursor++;
    }

    private function addActBoldtext($normalText)
    {
        $richText = new \PhpOffice\PhpSpreadsheet\RichText\RichText();
        $richText->createText($normalText);
        $payable = $richText->createTextRun('  (Указывается номер, дата акта о проведении испытаний)');
        $payable->getFont()->setBold(true);
        $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $richText);
    }

    public function insertNewPageHeader($excelRowCursor)
    {
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'alignment' => [
                'wrapText' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => [
                    'argb' => 'C1E1C1',
                ],
            ],
            'height' => $this->listHeaderHeight];
        $rowsData = array(' Наименование оборудования', 'Кол - во', 'Ед . изм - ия', '№ по переч . работ', 'январь', 'февраль',
            'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь');
        $this->insertJustTextDataInRow($excelRowCursor, 1, $rowsData, null, $styleArray);
    }

    public function checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry): bool
    {
        if (count($fieldPipeSeparated) > 1) {
            $fieldName = $fieldPipeSeparated[0];
        }
        $months = array('cel_january', 'cel_february', 'cel_march', 'cel_april', 'cel_may', 'cel_june', 'cel_july',
            'cel_august', 'cel_september', 'cel_october', 'cel_november', 'cel_december');
        foreach ($months as $month) {
            $fieldNameGray = $fieldName . '_gray';
            if ($fieldName == $month and $buildingsWithEquipmentEntry->$fieldNameGray == true) {
                $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $buildingsWithEquipmentEntry->$month);
                $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])->getFill()
                    ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('D3D3D3');

                $this->excelColumnCursor++;
                return true;
            } elseif ($fieldName == $month and $buildingsWithEquipmentEntry->$fieldNameGray !== true) {
                $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor],
                    $buildingsWithEquipmentEntry->$month);
                $this->excelColumnCursor++;
                return true;
            }
        }

        return false;
    }

    public function insertTableChunk($excelRowStart, $excelColumnStart, $fieldNames,
                                     $workBookNumber, $styleArray, $pageBreakEquipNumber = null, $isOneEntry = false)
    {
        $this->excelRowCursor = $excelRowStart;
        $this->excelColumnCursor = $excelColumnStart;

        foreach ($this->buildingsWithEquipment as $buildingsWithEquipmentEntry) {
            foreach ($fieldNames as $fieldName) {
                if ($fieldName == 'empty') {
                    $this->excelColumnCursor++;
                    continue;
                }
                if ($fieldName == 'equip_name') {
                    $richText = new \PhpOffice\PhpSpreadsheet\RichText\RichText();
                    $richText->createText($buildingsWithEquipmentEntry->equip_name);

                    if ($buildingsWithEquipmentEntry->to_ostanov_itr) {
                        $payable = $richText->createTextRun(' (на план . останове . Указать дату, ФИО, подпись ИТР проводящего ТО)');
                        $payable->getFont()->setBold(true);
                    }

                    $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $richText);
                    $this->excelColumnCursor++;
                    continue;
                }

                $fieldPipeSeparated = explode(' | ', $fieldName);

                if (count($fieldPipeSeparated) > 1 and $fieldPipeSeparated[1] == 'centered') {
                    $fieldNameToString = $fieldPipeSeparated[0];
                    $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])
                        ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                    $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])
                        ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                }

                if ($this->checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry)) {
                    continue;
                };

                if (count($fieldPipeSeparated) > 1) {
                    $fieldNameToString = $fieldPipeSeparated[0];
                    $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $buildingsWithEquipmentEntry->$fieldNameToString);
                } else {
                    $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $buildingsWithEquipmentEntry->$fieldName);
                }

                $this->excelColumnCursor++;

            }

            $this->excelColumnCursor = $excelColumnStart;
            $this->excelRowCursor++;
        }

        if (!is_null($styleArray)) {
            $range = $this->getLetterCoordinates($excelColumnStart, $excelRowStart,
                $excelColumnStart + count($fieldNames) - 1, $excelRowStart + count($this->buildingsWithEquipment) - 1);
            $this->sheet->getStyle($range)->applyFromArray($styleArray);

            foreach ($styleArray as $styleEntry => $styleValue) {
                if ($styleEntry === "height") {
                    $firstLastRowArr = $this->getFirstAndLastRowFromFullExcelRange($range);
                    for ($i = $firstLastRowArr[0]; $i <= $firstLastRowArr[1]; $i++) {
                        $this->sheet->getRowDimension($i)->setRowHeight($styleValue);
                    }
                }
            }

        }
    }
}
