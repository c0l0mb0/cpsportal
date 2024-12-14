<?php

namespace App\Export;

use JetBrains\PhpStorm\NoReturn;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


abstract class ExcelExport
{
    public $buildingsWithEquipment;
    public $affiliates;
    public $areas;

    public int $excelRowCursor;
    public int $excelColumnCursor;
    protected $sheet;
    public string $fileName;
    private string $templateFileName;
    protected $spreadsheet;
    protected $insertedDbChanksRangesArr = [];

    function __construct($fileName, $excelStartRowCursor, $excelStartColumnCursor, $templateFileName = '')
    {
        $this->fileName = $fileName;
        $this->templateFileName = $templateFileName;
        if ($this->templateFileName != '') {
            $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader("Xlsx");
            $this->spreadsheet = $reader->load("./../storage/excel_templates/pl_gr.xlsx");
        } else {
            $this->spreadsheet = new Spreadsheet();
        }
        $this->sheet = $this->spreadsheet->getActiveSheet();
        $this->spreadsheet->getDefaultStyle()->getFont()->setName('Times New Roman');
        $this->spreadsheet->getDefaultStyle()->getFont()->setSize(12);
        $this->areas = ['ГП', 'Ямбург', 'Новый Уренгой'];
        $this->excelRowCursor = $excelStartRowCursor;
        $this->excelColumnCursor = $excelStartColumnCursor;


    }

    abstract public function createHead();

    abstract public function createBody();

    public function run()
    {
        $this->createHead();
        $this->createBody();
        $this->exportFile();
    }

    #[NoReturn] private function exportFile()
    {
        $writer = new Xlsx($this->spreadsheet);
//        $writer = new Ods($this->spreadsheet);
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
        $this->excelColumnCursor = $excelColumnStart;
        $this->excelRowCursor = $excelRowStart;
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

    protected function insertTableChunk($excelRowStart, $excelColumnStart, $fieldNames,
                                     $workBookNumber, $styleArray, $pageBreakEquipNumber = null, $isOneEntry = false)
    {
        $this->excelRowCursor = $excelRowStart;
        $this->excelColumnCursor = $excelColumnStart;
        $range = '';
        $rowNumber = 1;
        foreach ($this->buildingsWithEquipment as $buildingsWithEquipmentEntry) {
            foreach ($fieldNames as $fieldName) {
                if ($fieldName == 'empty') {
                    $this->excelColumnCursor++;
                    continue;
                }
                if ($fieldName == 'row_counter') {
                    $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $rowNumber);
                    $this->excelColumnCursor++;
                    $rowNumber++;
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
                if (count($fieldPipeSeparated) > 1 and $fieldPipeSeparated[1] == 'horizontalLeft') {
                    $fieldNameToString = $fieldPipeSeparated[0];
                    $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor],
                        $buildingsWithEquipmentEntry->$fieldNameToString);
                    $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])
                        ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
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

//    return excel char range
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
            $textLinesInCell = substr_count($this->sheet->getCell([$column, $rowNumber])->getValue(), PHP_EOL) + 1;
            if ($maxTextLinesInCell < $textLinesInCell) {
                $maxTextLinesInCell = $textLinesInCell;
            }
        }
        return $maxTextLinesInCell;
    }

}
