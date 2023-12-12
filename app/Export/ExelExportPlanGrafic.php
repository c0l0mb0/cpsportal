<?php

namespace App\Export;

use App\Http\Controllers\BuildEquipController;
use App\Http\Controllers\BuildingsController;
use Exception;


class ExelExportPlanGrafic extends ExcelExport
{
    public $listSize = 1500;//1404
    public $listUsedHeight = 0;
    public $listHeaderHeight = 40;
    public $itrEquipHeidht = 35;
    public $firstSheetHeaderRowHeight = 30;
    public $buildingUpperHeaderHeight = 22;
    public $buildingLowerHeaderHeight = 150;
    public $equipItemHeight = 16;

    private $planGrafName;
    private $yearPlGr;
    private $whoApproveFio;
    private $whoApprovePosition;
    private $whoAssignFio;
    private $whoAssignPosition;

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
        $this->sheet->getPageMargins()->setTop(0.25)->setRight(0.25)->setLeft(0.25)
            ->setBottom(0.25);
        $this->sheet->getPageSetup()
            ->setOrientation(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::ORIENTATION_LANDSCAPE);
        $this->sheet->getPageSetup()
            ->setPaperSize(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::PAPERSIZE_A3);
        for ($i = 1; $i <= 9; $i++) {
            $this->sheet->getRowDimension($this->excelRowCursor)->setRowHeight($this->firstSheetHeaderRowHeight);
        }

        $this->sheet->getColumnDimension('A')->setWidth(70);
        $this->sheet->getColumnDimension('B')->setWidth(10);
        $this->sheet->getColumnDimension('C')->setWidth(10);
        $this->sheet->getColumnDimension('D')->setWidth(10);
        $this->sheet->getColumnDimension('E')->setWidth(22);
        $this->sheet->getColumnDimension('F')->setWidth(22);
        $this->sheet->getColumnDimension('G')->setWidth(22);
        $this->sheet->getColumnDimension('H')->setWidth(22);
        $this->sheet->getColumnDimension('I')->setWidth(22);
        $this->sheet->getColumnDimension('J')->setWidth(22);
        $this->sheet->getColumnDimension('K')->setWidth(22);
        $this->sheet->getColumnDimension('L')->setWidth(22);
        $this->sheet->getColumnDimension('M')->setWidth(22);
        $this->sheet->getColumnDimension('N')->setWidth(22);
        $this->sheet->getColumnDimension('O')->setWidth(22);
        $this->sheet->getColumnDimension('P')->setWidth(22);

        $this->sheet->getStyle('A10:G14')->getAlignment()->setWrapText(true);
        $this->excelRowCursor = 1;
        $this->excelColumnCursor = 14;
        $styleArray = [
            'font' => [
                'bold' => true,
                'size' => 23,
            ],
            'height' => $this->firstSheetHeaderRowHeight];
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('УТВЕРЖДАЮ'), null, $styleArray);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array($this->whoApprovePosition), null, $styleArray);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('ООО "Газпром добыча Ямбург"'), null, $styleArray);
        $this->excelRowCursor++;
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('_________________' . $this->whoApproveFio), null, $styleArray);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('"____"___________' . $this->yearPlGr . ' г.'), null, $styleArray);
        $this->excelRowCursor++;
        $this->excelColumnCursor = 1;
        $this->sheet->mergeCells('A8:P8');

        for ($i = 1; $i <= 6; $i++) {
            $this->sheet->mergeCells('N' . $i . ':P' . $i);
        }

        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('План-график проведения технического обслуживания и ремонта систем пожарной сигнализации, пожаротушения и управления эвакуацией ' . $this->planGrafName), null, $styleArray);
        $this->sheet->getStyle('A8')
            ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $this->insertNewPageHeader();
        $this->listUsedHeight = 8 * $this->firstSheetHeaderRowHeight + $this->listHeaderHeight;

    }

    public function createBody()
    {
        foreach ($this->planGrafBuildings as $planGrafBuilding) {
            $this->buildingsWithEquipment = BuildEquipController::getBuildingWithEquipmentByBuildingId([['buildings.id', '=', $planGrafBuilding->id]]);
            $buildingWithEquipSize = $this->buildingLowerHeaderHeight + $this->buildingUpperHeaderHeight + count($this->buildingsWithEquipment) * $this->equipItemHeight;

            if ($this->listUsedHeight + $buildingWithEquipSize > $this->listSize) { //if not fit
                if (count($this->buildingsWithEquipment) <= 6 or ($this->listUsedHeight + $this->buildingUpperHeaderHeight + $this->buildingLowerHeaderHeight +
                        3 * $this->equipItemHeight > $this->listSize)) { //if the building small
                    $this->sheet->setBreak([1, $this->excelRowCursor - 1], \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet::BREAK_ROW);
                    $this->insertNewPageHeader();
                    $this->insertBuildingData($planGrafBuilding);
                    $this->listUsedHeight = $this->listHeaderHeight + $this->buildingLowerHeaderHeight +
                        $this->buildingUpperHeaderHeight + count($this->buildingsWithEquipment) * $this->equipItemHeight;
                    continue;
                }
                //the building doesn't fit to the list, it's big one, and list's end divide building equipment near in half
                $amountOfEquipmentRowsFittedOnSheet = intval(($this->listSize - $this->listUsedHeight -
                        $this->buildingUpperHeaderHeight - $this->buildingLowerHeaderHeight) / $this->equipItemHeight);
                $this->insertBuildingData($planGrafBuilding, $amountOfEquipmentRowsFittedOnSheet);
                $this->listUsedHeight = (count($this->buildingsWithEquipment) - $amountOfEquipmentRowsFittedOnSheet) * $this->equipItemHeight + $this->listHeaderHeight;
                continue;
            }
            if ($this->listUsedHeight + $buildingWithEquipSize <= $this->listSize) {
                $this->insertBuildingData($planGrafBuilding, null);
                $this->listUsedHeight = $this->listUsedHeight + $buildingWithEquipSize;
            }
        }
        $this->excelRowCursor++;
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('empty', $this->whoAssignPosition, 'empty', 'empty', 'empty', $this->whoAssignFio,), null, null);
        $this->sheet->getPageSetup()->setPrintArea('A1:' . $this->sheet->getHighestColumn() . $this->sheet->getHighestRow());
        $this->sheet->mergeCells('B' . $this->excelRowCursor - 1 . ':D' . $this->excelRowCursor - 1);

        $this->setItrEquipHeight();
    }

    public function setItrEquipHeight()
    {
        for ($i = 1; $i <= $this->sheet->getHighestRow(); $i++) {
            $cellValue = $this->sheet->getCell([1, $i])->getValue();
            if (str_contains($cellValue, ' (на план. останове. Указать дату, ФИО, подпись ИТР проводящего ТО)')) {
                $this->sheet->getRowDimension($i)->setRowHeight($this->itrEquipHeidht);
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
        ];
        $this->sheet->getRowDimension($this->excelRowCursor)->setRowHeight($this->buildingUpperHeaderHeight);
        $rowsData = array($planGrafBuilding->shed, 'empty', 'empty', 'empty', 'Ф.И.О. подпись', 'Ф.И.О. подпись', 'Ф.И.О. подпись',
            'Ф.И.О. подпись', 'Ф.И.О. подпись', 'Ф.И.О. подпись', 'Ф.И.О. подпись', 'Ф.И.О. подпись', 'Ф.И.О. подпись',
            'Ф.И.О. подпись', 'Ф.И.О. подпись', 'Ф.И.О. подпись',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);
        $this->sheet->getRowDimension($this->excelRowCursor)->setRowHeight($this->buildingLowerHeaderHeight);

        $buildingNameWithGroupToDate = $this->getBuildingsWithEquipmentFieldValue('to_date');
        $rowsData = array(' Техническое обслуживание - ' . $buildingNameWithGroupToDate . ' число месяца', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'height' => $this->equipItemHeight];

        $fieldNames = array('equip_name', 'quantity|centered', 'measure|centered', 'to2_new|centered',
            'cel_january|centered', 'cel_february|centered', 'cel_march|centered',
            'cel_april|centered', 'cel_may|centered', 'cel_june|centered', 'cel_july|centered', 'cel_august|centered',
            'cel_september|centered', 'cel_october|centered', 'cel_november|centered', 'cel_december|centered');
        $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames, false, null, $styleArray, $amountOfEquipmentRowsFittedOnSheet);

    }

    public function insertNewPageHeader()
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
        $rowsData = array(' Наименование оборудования', 'Кол-во', 'Ед. изм-ия', '№ по переч. работ', 'январь', 'февраль',
            'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);
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

    public function insertTableChunk($excelRowStart, $excelColumnStart, $fieldNames, $isOneEntry = false,
                                     $workBookNumber, $styleArray, $pageBreakEquipNumber = null)
    {
        $this->excelRowCursor = $excelRowStart;
        $this->excelColumnCursor = $excelColumnStart;
        $range = '';
        $indexEquipment = 0;
        foreach ($this->buildingsWithEquipment as $buildingsWithEquipmentEntry) {
            foreach ($fieldNames as $fieldName) {
                if ($fieldName == 'empty') {
                    $this->excelColumnCursor++;
                    continue;
                }
                if ($fieldName == 'equip_name') {
                    $richText = new \PhpOffice\PhpSpreadsheet\RichText\RichText();
                    $richText->createText($buildingsWithEquipmentEntry->equip_name);
//                    if ($buildingsWithEquipmentEntry->to_ostanov) {
//                        $payable = $richText->createTextRun(' (на план. останове)');
//                        $payable->getFont()->setBold(true);
//                    }

                    if ($buildingsWithEquipmentEntry->to_ostanov_itr) {
                        $payable = $richText->createTextRun(' (на план. останове. Указать дату, ФИО, подпись ИТР проводящего ТО)');
                        $payable->getFont()->setBold(true);
                    }

                    $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $richText);
                    $this->excelColumnCursor++;
                    continue;
                }

                $fieldPipeSeparated = explode('|', $fieldName);

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
            if (!is_null($pageBreakEquipNumber) and ($indexEquipment + 1) === $pageBreakEquipNumber) {
                $this->sheet->setBreak([1, $this->excelRowCursor - 1], \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet::BREAK_ROW);
                $this->insertNewPageHeader();
            }
            $indexEquipment++;

            if ($isOneEntry === true) {
                $range = $this->getLetterCoordinates($excelColumnStart, $excelRowStart, $excelColumnStart + count($fieldNames) - 1, $excelRowStart);
                array_push($this->insertedDbChanksRangesArr, $range);
                break;
            } else {
                if (is_null($pageBreakEquipNumber)) {
                    $range = $this->getLetterCoordinates($excelColumnStart, $excelRowStart,
                        $excelColumnStart + count($fieldNames) - 1, $excelRowStart + count($this->buildingsWithEquipment) - 1);
                } else {
                    $range = $this->getLetterCoordinates($excelColumnStart, $excelRowStart,
                        $excelColumnStart + count($fieldNames) - 1, $excelRowStart + count($this->buildingsWithEquipment));
                }

                array_push($this->insertedDbChanksRangesArr, $range);
            }
        }

        if (!is_null($styleArray)) {
            $this->sheet->getStyle($range)->applyFromArray($styleArray);
//            throw new Exception('Division by zero.');
            foreach ($styleArray as $styleEntry => $styleValue) {
                if ($styleEntry === "height") {
                    $firstLastRowArr = $this->getFirstAndLastRowFromFullExcelRange($range);
                    for ($i = $firstLastRowArr[0]; $i <= $firstLastRowArr[1]; $i++) {
                        if (!is_null($pageBreakEquipNumber) and ($firstLastRowArr[0] + $pageBreakEquipNumber) == $i) {
                            $this->sheet->getRowDimension($i)->setRowHeight($this->listHeaderHeight);
//                            continue;
                        }
//                        $styleShrinkToFit = ['alignment' => ['wrapText' => true, 'shrinkToFit' => true,]];
//                        $this->sheet->getStyle('A' . $i . ':P' . $i)->applyFromArray($styleShrinkToFit);
                    }
                }
            }

        }
    }
}
