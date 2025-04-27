<?php

namespace App\Export;

use Exception;


class ExelExportExamReport extends ExcelExport

{
    private $name;
    private $patronymic;
    private $surname;
    private $tab_numb;
    private $report_theme;
    private $is_pass;
    private $start_time;
    private $finish_time;
    private $questAnswIsRightArr = [];

    public function setReportData($name, $patronymic, $surname, $tab_numb, $is_pass, $report_theme,
                                  $questAnswIsRightArr, $start_time, $finish_time)
    {
        $this->name = $name;
        $this->patronymic = $patronymic;
        $this->surname = $surname;
        $this->tab_numb = $tab_numb;
        $this->is_pass = $is_pass;
        $this->report_theme = $report_theme;
        $this->start_time = $start_time;
        $this->finish_time = $finish_time;
        $this->questAnswIsRightArr = $questAnswIsRightArr;
    }

    public
    function createHead()
    {

    }

    public
    function createBody()
    {
        $this->sheet->getColumnDimension('A')->setWidth(4);
        $this->sheet->getColumnDimension('B')->setWidth(40);
        $this->sheet->getColumnDimension('C')->setWidth(40);
        $this->sheet->getColumnDimension('D')->setWidth(20);
        $this->sheet->getStyle('A1:D100')->getAlignment()->setWrapText(true);

        $rowsData = array('empty', $this->surname . ' ' . $this->name . ' ' . $this->patronymic, 'empty', 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $rowsData = array('empty', 'Организация:', 'УАиМО ЦПС', 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $passingTheme = "";
        if ($this->report_theme === 'electroBez') {
            $passingTheme = "Подготовка и аттестация по профессии электромантер ОПС";
        }

        if ($this->report_theme === 'ops') {
            $passingTheme = "Подготовка и аттестация руководителей, специалистов и служащих организаций, осуществляющих эксплуатацию электроустановок потребителей";
        }
        $this->sheet->getRowDimension($this->excelRowCursor)->setRowHeight(65);
        $rowsData = array('empty', 'Предмет тестирования:', $passingTheme, 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $rowsData = array('empty', 'Дата и время начала тестирования:', $this->start_time, 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $rowsData = array('empty', 'Дата и время окончания тестирования:', $this->finish_time, 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);


        $rowsData = array('№', 'Вопрос', 'Ответ', 'Результат',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $rowStartTable = $this->excelRowCursor - 1;
        $totalWrongAnswers = 0;
        foreach ($this->questAnswIsRightArr as $index => $value) {
            $isRight = "Правильный ответ";
            if ($value['isRight'] === false) {
                $totalWrongAnswers++;
                $isRight = 'Неправильный ответ';
            }
            $rowsData = array($index + 1, $value['question'], $value['answer'], $isRight);
            $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);
        }
        $this->sheet->getStyle('A' . $rowStartTable . ':D' . $this->excelRowCursor - 1)->getBorders()->getAllBorders()
            ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
        for ($row = $rowStartTable; $row <= $this->excelRowCursor - 1; $row++) {
            $this->sheet->getRowDimension($row)->setRowHeight(-1);
            $highestNumberOfLines = $this->getHighestNumberOfTextLinesInRow($row,35);
            if ($highestNumberOfLines > 1) {
                $this->sheet->getRowDimension($row)->setRowHeight(16 * $highestNumberOfLines);
            }
        }

        $rowsData = array('empty', 'Допустимое количество ошибок:', '2', 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);


        $rowsData = array('empty', 'Допущено ошибок:', $totalWrongAnswers, 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $isPassExam = "Экзамен не сдан!";
        if ($this->is_pass === true) {
            $isPassExam = 'Экзамен  сдан!';
        }

        $rowsData = array('empty', 'Результат тестирования:', $isPassExam, 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $this->sheet->getRowDimension($this->excelRowCursor)->setRowHeight(33);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('empty', 'При проведении тестирования нарушений его порядка не зафиксировано', 'empty', 'empty',),
            null, null);

        $this->sheet->getRowDimension($this->excelRowCursor)->setRowHeight(33);
        $this->sheet->mergeCells('B' . $this->excelRowCursor . ':D' . $this->excelRowCursor);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('empty', 'Ответственный за проведение тестирования:__________________/__________________________________________/', 'empty', 'empty',),
            null, null);

        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('empty', 'Тестируемый__________________', '/' . $this->surname . '/', 'empty', 'empty'),
            null, null);

        $this->sheet->getStyle('A1:D' . $this->excelRowCursor)
            ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $this->sheet->getStyle('A1:D' . $this->excelRowCursor)
            ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);

        $this->sheet->getStyle('A1:D' . $this->excelRowCursor)->getAlignment()->setShrinkToFit(true);
        $this->sheet->getPageSetup()->setPrintArea('A1:' . 'D' . $this->excelRowCursor);
        $this->sheet->getPageSetup()->setFitToWidth(1);
    }


    public
    function checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry): bool
    {
        return false;
    }

    public function getHighestNumberOfTextLinesInRow($rowNumber, $charsInCell)
    {
        $highestNumberOfLines = 1;
        for ($i = 2; $i <= 3; $i++) {
            $numberOfLines = strlen($this->sheet->getCell([$i, $rowNumber])->getValue()) / $charsInCell;
            if ($numberOfLines > $highestNumberOfLines) {
                $highestNumberOfLines = $numberOfLines;
            }
        }
        return $highestNumberOfLines;
    }
}
