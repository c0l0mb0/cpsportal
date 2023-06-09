<?php

namespace App\Export;

use Exception;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


abstract class ExcelExport
{
    public $buildingsWithEquipment;
    public $affiliates;
    public $areas;
    public $planGrafBuildings;

    public int $excelRowCursor;
    public int $excelColumnCursor;
    protected $sheet;
    private string $fileName;
    protected $spreadsheet;
    protected $idBuilding;
    protected $insertedDbChanksRangesArr = [];

    function __construct($fileName, $excelStartRowCursor, $excelStartColumnCursor, $idBuilding)
    {
        $this->fileName = $fileName;
        $this->spreadsheet = new Spreadsheet();
        $this->sheet = $this->spreadsheet->getActiveSheet();
        $this->idBuilding = $idBuilding;
        $this->spreadsheet->getDefaultStyle()->getFont()->setName('Times New Roman');
        $this->spreadsheet->getDefaultStyle()->getFont()->setSize(12);
        $this->areas = ['ГП', 'Ямбург', 'Новый Уренгой'];
        $this->excelRowCursor = $excelStartRowCursor;
        $this->excelColumnCursor = $excelStartColumnCursor;
        $this->run();
    }

    abstract public function createHead();

    abstract public function createBody();

    public function run()
    {
        $this->createHead();
        $this->createBody();
        $this->exportFile();
    }

    private function exportFile()
    {
        $writer = new Xlsx($this->spreadsheet);
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . urlencode($this->fileName) . '"');
        $writer->save('php://output');

        $this->spreadsheet->disconnectWorksheets();
        exit();
    }

    protected function getBuildingsWithEquipmentFieldValue($fieldName)
    {
        if (!is_Null($this->buildingsWithEquipment[0]->$fieldName)) {
            return $this->buildingsWithEquipment[0]->$fieldName;
        }
        return null;
    }

    protected function insertJustTextDataInRow($excelRowStart, $excelColumnStart, $rowsData, $workBookNumber, $styleArray)
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

    public function insertTableChunk($excelRowStart, $excelColumnStart, $fieldNames, $isOneEntry = false, $workBookNumber, $styleArray, $pageBreakEquipNumber = null)
    {
        $this->excelRowCursor = $excelRowStart;
        $this->excelColumnCursor = $excelColumnStart;
        $range = '';
        foreach ($this->buildingsWithEquipment as $buildingsWithEquipmentEntry) {
            foreach ($fieldNames as $fieldName) {
                if ($fieldName == 'empty') {
                    $this->excelColumnCursor++;
                    continue;
                }
                $fieldPipeSeparated = explode('|', $fieldName);

                if (count($fieldPipeSeparated) > 1 and $fieldPipeSeparated[1] == 'centered') {
                    $fieldNameToString = $fieldPipeSeparated[0];
                    $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor],
                        $buildingsWithEquipmentEntry->$fieldNameToString);
                    $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])
                        ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                    $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])
                        ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
                    $this->excelColumnCursor++;
                    continue;
                }

                if ($this->checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry)) {
                    continue;
                };

                if ($fieldPipeSeparated[0] == 'custom' and !is_Null($fieldPipeSeparated[1])) {
                    $tmp = str_replace('&formulaRow', $this->excelRowCursor, $fieldPipeSeparated[1]);
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
                $range = $this->getLetterCoordinates($excelColumnStart, $excelRowStart, $excelColumnStart + count($fieldNames) - 1, $excelRowStart);
                array_push($this->insertedDbChanksRangesArr, $range);
                break;
            } else {
                $range = $this->getLetterCoordinates($excelColumnStart, $excelRowStart, $excelColumnStart + count($fieldNames) - 1, $excelRowStart + count($this->buildingsWithEquipment) - 1);
                array_push($this->insertedDbChanksRangesArr, $range);
            }
        }

        if (!is_null($styleArray)) {
            foreach ($styleArray as $styleEntry => $styleValue) {
                if ($styleEntry === "height") {
                    $firstLastRowArr = $this->getFirstAndLastRowFromFullExcelRange($range);
                    for ($i = $firstLastRowArr[0]; $i <= $firstLastRowArr[1]; $i++) {
                        $this->sheet->getRowDimension($i)->setRowHeight($styleValue);
                    }
                }
            }
            $this->sheet->getStyle($range)->applyFromArray($styleArray);
        }
    }

    abstract public function checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry);

    protected function getLetterCoordinates($excelColumnFirst, $excelRowFirst, $excelColumnLast, $excelRowLast,)
    {
        $excelColumnFirstLetter = $this->getNameFromNumber($excelColumnFirst);
        $excelColumnLastLetter = $this->getNameFromNumber($excelColumnLast);

        return $excelColumnFirstLetter . $excelRowFirst . ':' . $excelColumnLastLetter . $excelRowLast;
    }

    public function getFirstAndLastRowFromFullExcelRange($range)
    {
        $rangeSeparated = explode(':', $range);
        $firstRow = preg_replace("/[^0-9]/", "", $rangeSeparated[0]);
        $lastRow = preg_replace("/[^0-9]/", "", $rangeSeparated[1]);
        return array($firstRow, $lastRow);
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

    private function getNumberFromLetter($string)
    {
        $string = strtoupper($string);
        $length = strlen($string);
        $number = 0;
        $level = 1;
        while ($length >= $level) {
            $char = $string[$length - $level];
            $c = ord($char) - 64;
            $number += $c * (26 ** ($level - 1));
            $level++;
        }
        return $number;
    }

    public function getMaxTextLinesInRow($rowNumber)
    {
        $maxTextLinesInCell = 1;
        for ($column = 1; $column <= $this->getNumberFromLetter($this->sheet->getHighestColumn()); $column++) {
//            $symbolsCount = mb_strlen($this->sheet->getCell([$column, $rowNumber])->getValue(), 'utf8');
//            $textLinesInCell = mb_substr_count($this->sheet->getCell([$column,$rowNumber])->getValue(), "0xE2 0x90 0xA4") + 1;
            $textLinesInCell = substr_count($this->sheet->getCell([$column,$rowNumber])->getValue(), PHP_EOL ) + 1;
            if ($maxTextLinesInCell < $textLinesInCell) {
                $maxTextLinesInCell = $textLinesInCell;
            }
        }
        return $maxTextLinesInCell;
    }

}
