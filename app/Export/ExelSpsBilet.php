<?php

namespace App\Export;

use App\Http\Controllers\BuildEquipController;
use App\Http\Controllers\SpsTestController;
use Exception;


class ExelSpsBilet extends ExcelExport

{
    private $questions;


    public function createHead()
    {

    }

    public function createBody()
    {
        $this->sheet->getColumnDimension('B')->setWidth(150);
        $this->questions = SpsTestController::index();

        $questionNumber = 1;
        foreach ($this->questions as $question) {
            $questionText = $question['question'];
            $answer_1 = $question['answer_1'];
            $answer_2 = $question['answer_2'];
            $answer_3 = $question['answer_3'];
            $answer_4 = $question['answer_4'];
            $answer_5 = $question['answer_5'];
            $correctAnswerNumb = $question['correct_answer'];
            $note = $question['note'];
            $pictPath = $question['pict_path'];

            $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $questionNumber);
            $this->excelColumnCursor++;

            $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $questionText);
            $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                ->setARGB('ced7ed00');

            if (!is_null($pictPath)) {
                $this->excelColumnCursor++;
                $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $pictPath);
                $this->excelColumnCursor--;
            };


            $this->excelRowCursor++;

            $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $answer_1);
            if ($correctAnswerNumb === 1) {
                $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])->getFill()
                    ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('green');
            };
            $this->excelRowCursor++;
            $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $answer_2);
            if ($correctAnswerNumb === 2) {
                $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])->getFill()
                    ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('green');
            };
            $this->excelRowCursor++;
            $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $answer_3);
            if ($correctAnswerNumb === 3) {
                $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])->getFill()
                    ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                    ->setARGB('green');
            };
            $this->excelRowCursor++;
            if ($answer_4 != '') {
                $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $answer_4);
                if ($correctAnswerNumb === 4) {
                    $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])->getFill()
                        ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('green');
                };
                $this->excelRowCursor++;
            }


            if ($answer_5 != '') {
                $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $answer_5);
                if ($correctAnswerNumb === 5) {
                    $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])->getFill()
                        ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                        ->setARGB('green');
                };
                $this->excelRowCursor++;
            }

            $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], $note);
            $this->sheet->getStyle([$this->excelColumnCursor, $this->excelRowCursor])->getFill()
                ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()
                ->setARGB('D3D3D3');
            $this->excelRowCursor++;
            $questionNumber++;
            $this->excelColumnCursor--;
        }

        $this->sheet->getStyle('A1:' . $this->sheet->getHighestColumn() . $this->sheet->getHighestRow())
            ->getAlignment()->setWrapText(true);
    }


    public function checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry): bool
    {
        return false;
    }
}
