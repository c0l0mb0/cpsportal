<?php

namespace App\Export;


use Exception;
use JetBrains\PhpStorm\NoReturn;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExelExportActInvestigation

{
    private $approve_fio;
    private $area;
    private $commission_memb_1;
    private $commission_memb_1_occupation;
    private $commission_memb_2;
    private $commission_memb_2_occupation;
    private $commission_memb_3;
    private $commission_memb_3_occupation;
    private $date;
    private $element_code;
    private $element_code_group;
    private $external_signs;
    private $fault_reason;
    private $fault_reason_group;
    private $fault_reason_tu;
    private $full_description;
    private $group_1;
    private $group_2;
    private $immediately_actions;
    private $prevent_actions;
    private $shed;
    private $short_description;
    private $actTime;
    private $usage_hours;
    private $fileName;
    private $templateName;
    private $sheet;
    private $spreadsheet;
    private $date_issue;


    public function setActParameters($act_investigate_approve_fio, $act_investigate_area,
                                     $act_investigate_commission_memb_1, $act_investigate_commission_memb_1_occupation,
                                     $act_investigate_commission_memb_2, $act_investigate_commission_memb_2_occupation,
                                     $act_investigate_commission_memb_3, $act_investigate_commission_memb_3_occupation,
                                     $act_investigate_date, $act_investigate_element_code,
                                     $act_investigate_element_code_group, $act_investigate_external_signs,
                                     $act_investigate_fault_reason, $act_investigate_fault_reason_group,
                                     $act_investigate_fault_reason_tu, $act_investigate_full_description,
                                     $act_investigate_group_1, $act_investigate_group_2,
                                     $act_investigate_immediately_actions, $act_investigate_prevent_actions,
                                     $act_investigate_shed, $act_investigate_short_description, $act_investigate_time,
                                     $act_investigate_date_issue, $usage_hours)
    {
        $this->approve_fio = $act_investigate_approve_fio;
        $this->area = $act_investigate_area;
        $this->commission_memb_1 = $act_investigate_commission_memb_1;
        $this->commission_memb_1_occupation = $act_investigate_commission_memb_1_occupation;
        $this->commission_memb_2 = $act_investigate_commission_memb_2;
        $this->commission_memb_2_occupation = $act_investigate_commission_memb_2_occupation;
        $this->commission_memb_3 = $act_investigate_commission_memb_3;
        $this->commission_memb_3_occupation = $act_investigate_commission_memb_3_occupation;
        $this->date = $act_investigate_date;
        $this->element_code = $act_investigate_element_code;
        $this->element_code_group = $act_investigate_element_code_group;
        $this->external_signs = $act_investigate_external_signs;
        $this->fault_reason = $act_investigate_fault_reason;
        $this->fault_reason_group = $act_investigate_fault_reason_group;
        $this->fault_reason_tu = $act_investigate_fault_reason_tu;
        $this->full_description = $act_investigate_full_description;
        $this->group_1 = $act_investigate_group_1;
        $this->group_2 = $act_investigate_group_2;
        $this->immediately_actions = $act_investigate_immediately_actions;
        $this->prevent_actions = $act_investigate_prevent_actions;
        $this->shed = $act_investigate_shed;
        $this->short_description = $act_investigate_short_description;
        $this->actTime = $act_investigate_time;
        $this->date_issue = $act_investigate_date_issue;
        $this->usage_hours = $usage_hours;
    }

    function __construct($fileName, $templateName)
    {
        $this->fileName = $fileName;
        $this->templateName = $templateName;

        $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader("Xlsx");
        $this->spreadsheet = $reader->load("./../storage/excel_templates/act_investigation.xlsx");

        $this->sheet = $this->spreadsheet->getActiveSheet();

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

    public function run()
    {
        foreach ($this->sheet->getRowIterator() as $row) {
            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(FALSE);
            foreach ($cellIterator as $cell) {
                $cellValue = $cell->getValue();
                $numberOccurrences = substr_count($cellValue, '&');
                for ($i = 0; $i <= $numberOccurrences; $i++) {
                    $replacedValue = $this->doReplace($cellValue);
                    if ($replacedValue !== false) {
                        try {
                            $cell->setValue($replacedValue);
                            $cellValue = $replacedValue;
                        } catch (Exception $e) {
                            print_r($e);
                        }
                    }
                }

            }
        }
        $this->exportFile();
    }

    private function doReplace($cellValue)
    {
        $searchedValues = ['&approve_occupation$',
            '&area$',
            '&approve_fio$',
            '&group_1$',
            '&group_2$',
            '&fault_reason_tu$',
            '&year$',
            '&gp_numb$',
            '&dd/mm/yyyy$',
            '&hh:mm:ss$',
            '&external_signs$',
            '&short_description$',
            '&commission_memb_1$',
            '&commission_memb_1_occupation$',
            '&commission_memb_2$',
            '&commission_memb_2_occupation$',
            '&commission_memb_3$',
            '&commission_memb_3_occupation$',
            '&full_description$',
            '&immediately_actions$',
            '&fault_reason$',
            '&element_code$',
            '&usage_hours$',
            '&prevent_actions$',
            '&date_plus_three_days$',
            '&year_last_two_numb$',
            '&dd.mm.yyyy$'
        ];

        foreach ($searchedValues as $searchedValue) {
            $pos = strpos($cellValue, $searchedValue);
            if ($pos !== false) {
                if ($searchedValue === '&approve_occupation$') {
                    $approveOccupation = '';
                    if ($this->approve_fio === 'С.И. Гункин') {
                        $approveOccupation = 'Начальник ф. УАиМО';
                    }
                    if ($this->approve_fio === 'А.А. Турбин') {
                        $approveOccupation = 'Главный инженер ф. УАиМО';
                    }
                    if ($this->approve_fio === 'О.Л. Деревянных') {
                        $approveOccupation = 'Заместитель начальника управления по производству ф. УАиМО';
                    }
                    return str_replace("&approve_occupation$", $approveOccupation, $cellValue);
                }

                if ($searchedValue === '&letter_month$') {
                    $ru_month = array('Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август',
                        'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь');
                    $monthNumber = date("n", strtotime($this->date));
                    $month = $ru_month[$monthNumber - 1];
                    return str_replace("&letter_month$", $month, $cellValue);
                }

                if ($searchedValue === '&year$') {
                    $year = date("Y", strtotime($this->date));
                    return str_replace("&year$", $year, $cellValue);
                }

                if ($searchedValue === '&year_last_two_numb$') {
                    $year = date("y", strtotime($this->date));
                    return str_replace("&year_last_two_numb$", $year, $cellValue);
                }

                if ($searchedValue === '&gp_numb$') {
                    $pos = strpos($this->group_1, 'ГП');
                    if ($pos !== false) {
                        $gpNmb = substr((int)filter_var($this->group_1, FILTER_SANITIZE_NUMBER_INT), 1);
                        return str_replace('&gp_numb$', $gpNmb, $cellValue);
                    } else {
                        return str_replace('&gp_numb$', '', $cellValue);
                    }
                }

                if ($searchedValue === '&dd/mm/yyyy$') {
                    $d = date("d/m/y", strtotime($this->date));
                    return str_replace('&dd/mm/yyyy$', $d, $cellValue);
                }
                if ($searchedValue === '&dd.mm.yyyy$') {
                    $d = date("d.m.Y", strtotime($this->date_issue));
                    return str_replace('&dd.mm.yyyy$', $d, $cellValue);

                }
                if ($searchedValue === '&hh:mm:ss$') {
                    $d = date("G:i:s", strtotime($this->actTime));
                    return str_replace('&hh:mm:ss$', $d, $cellValue);
                }

                if ($searchedValue === '&date_plus_three_days$') {
                    $d = date("d/m/y", strtotime($this->date));
                    return str_replace('&date_plus_three_days$', $d, $cellValue);
                }

                $objectProperty = substr($searchedValue, 1);
                $objectProperty = substr($objectProperty, 0, -1);
                $valueToReplace = $this->$objectProperty;

                return str_replace($searchedValue, $valueToReplace, $cellValue);
            }
        }
        return false;

    }


}
