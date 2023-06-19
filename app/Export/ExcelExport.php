<?php

namespace App\Export;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


abstract class ExcelExport
{
    public $buildingsWithEequipment;
    public $affiliates;
    public $areas;
    public int $excelRowCursor;
    public int $excelColumnCursor;
    protected $sheet;
    private string $fileName;
    private $spreadsheet;

    function __construct($fileName, $excelStartRowCursor, $excelStartColumnCursor)
    {
        $this->fileName = $fileName;
        $this->spreadsheet = new Spreadsheet();
        $this->sheet = $this->spreadsheet->getActiveSheet();
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
            $this->sheet->getStyle($range)->applyFromArray($styleArray);
        }

        $this->excelColumnCursor = $excelColumnStart;
        $this->excelRowCursor++;
    }

    protected function insertTableChunk($excelRowStart, $excelColumnStart, $fieldNames, $isOneEntry = false, $workBookNumber, $styleArray)
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
                break;
            } else {
                $range = $this->getLetterCoordinates($excelColumnStart, $excelRowStart, $excelColumnStart + count($fieldNames) - 1, count($this->buildingsWithEequipment));
            }
        }

        if (!is_null($styleArray)) {
            $this->sheet->getStyle($range)->applyFromArray($styleArray);
        }
    }

    abstract public function checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry);

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
