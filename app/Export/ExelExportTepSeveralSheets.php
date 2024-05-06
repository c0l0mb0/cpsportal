<?php

namespace App\Export;

use App\Http\Controllers\BuildEquipController;
use Exception;


class ExelExportTepSeveralSheets extends ExcelExport

{
    private $idBuilding;
    private $firstPageLastRowInTable;

    public function setIdBuilding($id)
    {
        $this->idBuilding = $id;
    }

    public function createHead()
    {
        $currentBuildingId = $this->idBuilding;
        $this->buildingsWithEquipment = BuildEquipController::getBuildingWithEquipmentByBuildingId([
            ['buildings.id', '=', $currentBuildingId]]);

        $this->sheet->setTitle('ТЭП здания');

        $this->sheet->getColumnDimension('A')->setWidth(6);
        $this->sheet->getColumnDimension('B')->setWidth(46);
        $this->sheet->getColumnDimension('C')->setWidth(25);
        $this->sheet->getColumnDimension('D')->setWidth(12);
        $this->sheet->getColumnDimension('E')->setWidth(10);
        $this->sheet->getColumnDimension('F')->setWidth(10);
        $this->sheet->getColumnDimension('G')->setWidth(58);
        $this->sheet->getColumnDimension('H')->setWidth(10);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'СОГЛАСОВАНО');
        $this->excelRowCursor++;
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'Заместитель главного инженера по АМОиС');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'ООО "Газпром добыча Ямбург"');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', '______________________С.В. Завьялов');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', ' "_______" __________________' . date("Y") . ' г.');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $this->excelRowCursor++;
        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':G' . $this->excelRowCursor);
        $styleArray = [
            'font' => [
                'bold' => true,
            ],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,]];
        $rowsData = array('Технико-экономические показатели для расчета нормативной численности рабочих участка ПС на ГП ЦПС  филиала УАиМО',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);
        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':G' . $this->excelRowCursor);

        $rowsData = array('на  объектах филиала ГПУ по состоянию на  ' . date("Y") . ' г.',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);

        $this->excelRowCursor++;


        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,],
            'height' => 50,
        ];

        $rowsData = array('№ п/п', 'Наименование показателей', 'Тип, марка первичного прибора', 'Ед. изм.',
            'Кол-во установлен-ного оборуд.', 'Тип канала', 'Примечание', 'кол-во систем');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);

        $rowsData = array('1', '2', '3', '4', '5', '6', '7', 'empty');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);

        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':G' . $this->excelRowCursor);
        $buildingNameWithGroup = $this->getBuildingsWithEquipmentFieldValue('group_1') . " " .
            $this->getBuildingsWithEquipmentFieldValue('group_2') . " " .
            $this->getBuildingsWithEquipmentFieldValue('shed');
        $rowsData = array($buildingNameWithGroup);
        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            ],
        ];
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, $styleArray);

    }


    public function createBody()
    {
        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,],
        ];
        $fieldNames = array('row_counter', 'equip_name_extracted_type', 'equip_name_extracted_brand', 'measure',
            'quantity', 'kind_signal', 'proj', 'has_channels_numb');
        $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames, false,
            null, $styleArray);
        $this->firstPageLastRowInTable = $this->excelRowCursor - 1;
        $this->createSecondPageItogRabochieHead();
        $this->createSecondPageItogRabochieBody();
        $this->createThirdPageItogItrHead();
        $this->createThirdPageItogItrBody();
        $this->createFourthPage2Dot6Head();
        $this->createFourthPage2Dot6Body();
        $this->createFifthPage2Dot7PoHead();
        $this->createFifthPage2Dot7PoBody();

        $this->createSixthPage2Dot7RmHead();
        $this->createSixthPage2Dot7RmBody();
    }

    private function createSixthPage2Dot7RmHead()
    {
        $this->spreadsheet->createSheet();
        $this->sheet = $this->spreadsheet->setActiveSheetIndex(5);
        $this->sheet->setTitle('2.7 РМ');
        $this->excelRowCursor = 1;
        $this->sheet->getColumnDimension('A')->setWidth(8);
        $this->sheet->getColumnDimension('B')->setWidth(34);
        $this->sheet->getColumnDimension('C')->setWidth(34);
        $this->sheet->getColumnDimension('D')->setWidth(29);
        $this->sheet->getColumnDimension('E')->setWidth(34);

        $this->sheet->mergeCells('A1:F1');

        $styleArray = [
            'font' => [
                'bold' => true,
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
            ],
            'height' => 30,
        ];

        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array(' п.2.7.  Поддержка пользователя программного обеспечения по ЦПС'),
            null, $styleArray);

        $this->excelRowCursor++;
        $this->excelRowCursor++;

        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,],
            'height' => 50,
        ];

        $rowsData = array('№ п/п', 'Функциональное назначение (либо DNS имя компьютера)', 'Наименование АРМ ',
            'Место установки', 'Пользователь', 'Операционная система', 'Платформа',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'Видеоадаптер', 'empty',
            'empty', 'HDD', 'empty', 'CD/DVD', 'Монитор', 'empty', 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'Системная плата', 'empty', 'empty',
            'empty', 'Процессор', 'empty', 'Модули ОЗУ', 'empty', 'empty', 'empty', 'Интегрированный (+ / -)',
            'Внешний', 'empty', 'Интерфейс (IDE, SATA, SCSI)', 'Емкость, Gb', 'Тип (СD-RW, DVD-ROM и т.п.)',
            'Марка', 'Модель', 'Размер, "');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);

        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'Марка', 'Модель',
            'Форм-фактор (AT, ATX, и пр.)',
            'Чипсет', 'Модель', 'Частота, GHz', 'Форм-фактор', 'Тип', 'Объем, Mb', 'Количество, шт.', 'empty',
            'Шина (AGP, PCI, PCI-X)', 'Модель', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);

        $this->sheet->mergeCells('A4:A6');
        $this->sheet->mergeCells('B4:B6');
        $this->sheet->mergeCells('C4:C6');
        $this->sheet->mergeCells('D4:D6');
        $this->sheet->mergeCells('E4:E6');
        $this->sheet->mergeCells('F4:F6');

        $this->sheet->mergeCells('G4:P4');
        $this->sheet->mergeCells('Q4:S4');
        $this->sheet->mergeCells('T4:U4');
        $this->sheet->mergeCells('W4:Y4');

        $this->sheet->mergeCells('G5:J5');
        $this->sheet->mergeCells('K5:L5');
        $this->sheet->mergeCells('M5:P5');
        $this->sheet->mergeCells('Q5:Q6');
        $this->sheet->mergeCells('R5:S5');
        $this->sheet->mergeCells('T5:T6');
        $this->sheet->mergeCells('U5:U6');
        $this->sheet->mergeCells('V5:V6');
        $this->sheet->mergeCells('W5:W6');
        $this->sheet->mergeCells('X5:X6');
        $this->sheet->mergeCells('Y5:Y6');
        $rowsData = array('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);
        $rowsData = array('empty', 'участок ПС ' . $this->getBuildingsWithEquipmentFieldValue('area'),
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);
        $rowsData = array('1', 'empty',
            'empty', 'empty', 'оператор', 'РЕДОС', 'GIGABYTE', 'X570', 'AT', 'AMD X570',
            'intel Core', '2.8', 'DDR4 - 2x', 'CMW16GX4M2C3200C16', '8ГБ', '2', 'empty', 'PCI-X', 'MSI GeForce GTX 1050TI', 'SATA', '1ТБ',
            'DVD-ROM', 'lenovo', '66aekac1eu', '24',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);
        $rowsData = array('1', ' - Количество рабочих мест, на которых осуществляется поддержка пользователя',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            null);
    }

    private function createSixthPage2Dot7RmBody()
    {

    }

    private function createFifthPage2Dot7PoBody()
    {
        $this->buildingsWithEquipment = BuildEquipController::getBuildingWithEquipmentByBuildingId([
            ['buildings.id', '=', $this->idBuilding], ['has_channels', '=', true]]);
        $equipWithChannalsProgram = $this->getBuildingsWithEquipmentFieldValue('programs');
        $this->buildingsWithEquipment = BuildEquipController::getBuildingWithEquipmentByBuildingId([
            ['buildings.id', '=', $this->idBuilding]]);
        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,],
            'height' => 50,
        ];
        $rowsData = array('empty', 'участок ' . $this->getBuildingsWithEquipmentFieldValue('area'),
            'empty', 'empty', 'empty');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);
        $buildingNameWithGroup = $this->getBuildingsWithEquipmentFieldValue('group_1') . " " .
            $this->getBuildingsWithEquipmentFieldValue('group_2') . " " .
            $this->getBuildingsWithEquipmentFieldValue('shed');
        $rowsData = array('1', $buildingNameWithGroup,
            $buildingNameWithGroup, '1', $equipWithChannalsProgram);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);

        $this->excelRowCursor++;
        $this->excelRowCursor++;

        $rowsData = array('empty', 'empty', 'Итого количество программ:', '=SUM(D4:D' . $this->excelRowCursor - 3 . ')',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            null);
    }

    private function createFifthPage2Dot7PoHead()
    {
        $this->spreadsheet->createSheet();
        $this->sheet = $this->spreadsheet->setActiveSheetIndex(4);
        $this->sheet->setTitle('2.7 ПО');
        $this->excelRowCursor = 1;
        $this->sheet->getColumnDimension('A')->setWidth(8);
        $this->sheet->getColumnDimension('B')->setWidth(34);
        $this->sheet->getColumnDimension('C')->setWidth(34);
        $this->sheet->getColumnDimension('D')->setWidth(29);
        $this->sheet->getColumnDimension('E')->setWidth(34);

        $this->sheet->mergeCells('A1:E1');

        $styleArray = [
            'font' => [
                'bold' => true,
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
            ],
            'height' => 50,
        ];

        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('2.7. Поддержка пользователя и ПО. Количество программ, по которым осуществляется поддержка пользователя по плану на год (ввод ' . date("Y") . ' г)'),
            null, $styleArray);

        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,],
            'height' => 50,
        ];
        $rowsData = array('№ п/п', 'Объект, где используется ПО', 'Наименование  места установки ПО', 'Количество программ', 'Тип программы');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);


    }

    private function createFourthPage2Dot6Body()
    {
        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,],
            'height' => 50,
        ];

        $this->buildingsWithEquipment = BuildEquipController::getBuildingWithEquipmentByBuildingId([
            ['buildings.id', '=', $this->idBuilding], ['has_channels', '=', true]]);
        if ($this->buildingsWithEquipment->isNotEmpty()) {
//            throw new Exception($this->buildingsWithEquipment);
            $row = $this->excelRowCursor;
            $rowsData = array($this->getBuildingsWithEquipmentFieldValue('equip_name'), '10', '4', '10', '4',
                '10', '3', '10', '4', '=CHOOSE(C' . $row . ',0.0082,0.0057,0.0045,0.0037)*B' . $row . '+CHOOSE(E' . $row .
                ',0.0035,0.002,0.0012,0.0006)*D' . $row . '+CHOOSE(G' . $row . ',0.0045,0.0031,0.002,0.0012)*F' . $row .
                '+CHOOSE(I' . $row . ',0.0135,0.0094,0.0069,0.0049)*H' . $row, '10', '1', '=J' . $row . '*(1+0.1*L' .
                $row . ')*K' . $row);
            $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
                null, $styleArray);

            $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
                'empty', 'Итого:', 'empty', '=SUM(L5:L' . $row . ')', '=SUM(M5:M' . $row . ')',);
            $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
                null, null);

        }

    }

    private function createFourthPage2Dot6Head()
    {
        $this->spreadsheet->createSheet();
        $this->sheet = $this->spreadsheet->setActiveSheetIndex(3);
        $this->sheet->setTitle('п.2.6');
        $this->excelRowCursor = 1;
        $this->sheet->getColumnDimension('A')->setWidth(44);
        $this->sheet->getColumnDimension('B')->setWidth(4);
        $this->sheet->getColumnDimension('D')->setWidth(4);
        $this->sheet->getColumnDimension('F')->setWidth(4);
        $this->sheet->getColumnDimension('H')->setWidth(4);
        $this->sheet->getColumnDimension('K')->setWidth(4);

        $this->sheet->mergeCells('A1:M1');
        $styleArray = [
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            ]];
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('п. 2.6 Сопровождение и внедрение программного обеспечения АСПС, КЗ и ПТ на объектах ЯНГКМ'),
            null, $styleArray);
        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,],
            'height' => 50,
        ];
        $rowsData = array('Наименование обслуживаемых и разработанных программм',
            'Расчет норматива на 1 программную единицу', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'Учет кол-ва объектов и удаленности', 'empty', 'Итоговый норматив',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, $styleArray);
        $rowsData = array('empty', 'Вх. Формы', 'empty', 'Вых формы', 'empty', 'НСИ', 'empty', 'Алгоритмы', 'empty',
            'Норматив', 'K раз', 'N об', 'empty');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, $styleArray);
        $rowsData = array('empty', 'N', 'Группа сложности', 'N', 'Группа сложности', 'N', 'Группа сложности', 'N',
            'Группа сложности', 'empty', 'empty', 'empty', 'empty');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, $styleArray);
        $this->sheet->mergeCells('A2:A4');
        $this->sheet->mergeCells('B2:J2');
        $this->sheet->mergeCells('K2:L2');
        $this->sheet->mergeCells('M2:M4');

        $this->sheet->mergeCells('B3:C3');
        $this->sheet->mergeCells('D3:E3');
        $this->sheet->mergeCells('F3:G3');
        $this->sheet->mergeCells('H3:I3');

        $this->sheet->mergeCells('J3:J4');
        $this->sheet->mergeCells('K3:K4');
        $this->sheet->mergeCells('L3:L4');


    }

    private function createThirdPageItogItrHead()
    {
        $this->spreadsheet->createSheet();
        $this->sheet = $this->spreadsheet->setActiveSheetIndex(2);
        $this->sheet->setTitle('ИТР');
        $this->excelRowCursor = 2;
        $this->sheet->getColumnDimension('A')->setWidth(8);
        $this->sheet->getColumnDimension('B')->setWidth(4);
        $this->sheet->getColumnDimension('V')->setWidth(38);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'СОГЛАСОВАНО');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'Заместитель главного инженера по АМОиС');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'ООО «Газпром добыча Ямбург»');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', '_______________С.В. Завьялов');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', ' "_______" __________________' . date("Y") . ' г.');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, null);
        $this->excelRowCursor++;
        $this->excelRowCursor++;
        $styleArray = [
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
            ]];
        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':T' . $this->excelRowCursor);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('Дополнительный расчет'),
            null, $styleArray);
        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':T' . $this->excelRowCursor);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('количества приведенных каналов и ПТС в системах АСУ ТП, пожарной автоматики и телемеханики '),
            null, $styleArray);
        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':T' . $this->excelRowCursor);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor,
            array('обслуживаемых филиалом "Управление автоматизации и МО"'), null, $styleArray);

        $this->excelRowCursor++;
        $this->excelRowCursor++;

        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,],
            'height' => 50,
        ];

        $rowsData = array('№ п/п', 'empty', 'Объект', 'empty', 'Един. изм.', 'Количество (объем)', 'empty',
            'Кол-во каналов  в системах', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'Кол-во приведенных каналов по категориям технической сложности', 'empty', 'empty',
            'Общее количество каналов', 'empty', 'empty',
            'Подтверждение (проект, выгрузка конфигурации из БД системы и т.п.)');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);

        $this->sheet->mergeCells('A14:B15');
        $this->sheet->mergeCells('A16:B16');
        $this->sheet->mergeCells('C14:D14');
        $this->sheet->mergeCells('E14:E15');
        $this->sheet->mergeCells('F14:G14');
        $this->sheet->mergeCells('H14:O14');
        $this->sheet->mergeCells('P14:R14');
        $this->sheet->mergeCells('S14:U14');


        $rowsData = array('empty', 'empty', 'Наименование структурнуго подразделения, обслуживаемого оборудования',
            'категория техн. сложности', 'empty', 'ПТС', 'систем', 'Nк.инф.д', 'Nк.упр.д.', 'Nк.инф.ан.', 'Nк.упр.ан.',
            'Nк.иуц', 'Nк.инф.ч.', 'Nк.инф.рч.', 'Nк. Пр', 'Nкан1кат', 'Nкан2кат', 'Nкан3кат', 'Nк. 1кат.',
            'Nк. 2кат.', 'Nк. 3 кат.', 'empty',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);
        $rowsData = array('1', 'empty', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17',
            '18', '19', '20', 'empty');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);
        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,],
        ];
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('ЯНГКМ', 'empty',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'),
            null, $styleArray);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('1.', 'empty',
            'Цех пожарной сигнализации', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'),
            null, $styleArray);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('1.1.',
            'empty', 'Участок пожарной сигнализации на ' . $this->getBuildingsWithEquipmentFieldValue('area'),
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'),
            null, $styleArray);
        $this->sheet->mergeCells('A17:V17');
        $this->sheet->mergeCells('A18:B18');
        $this->sheet->mergeCells('C18:V18');
        $this->sheet->mergeCells('A19:B19');
        $this->sheet->mergeCells('C19:V19');
    }

    private function createThirdPageItogItrBody()
    {
        $this->buildingsWithEquipment = BuildEquipController::getBuildingWithEquipmentByBuildingId([
            ['buildings.id', '=', $this->idBuilding]]);

        $row = $this->excelRowCursor;
        $rowsData = array('empty', '1', $this->getBuildingsWithEquipmentFieldValue('shed'),
            $this->getBuildingsWithEquipmentFieldValue('categ_asu'), 'шт.', '1', '1',
            '=SUMIF(\'ТЭП здания\'!' . 'F14:F' . $this->firstPageLastRowInTable . ',"ИД",\'ТЭП здания\'!' .
            'E15:E' . $this->firstPageLastRowInTable . ')',
            '=SUMIF(\'ТЭП здания\'!' . 'F14:F' . $this->firstPageLastRowInTable . ',"УД",\'ТЭП здания\'!' .
            'E15:E' . $this->firstPageLastRowInTable . ')',
            '=SUMIF(\'ТЭП здания\'!' . 'F14:F' . $this->firstPageLastRowInTable . ',"ИА",\'ТЭП здания\'!' .
            'E15:E' . $this->firstPageLastRowInTable . ')',
            '=SUMIF(\'ТЭП здания\'!' . 'F14:F' . $this->firstPageLastRowInTable . ',"УА",\'ТЭП здания\'!' .
            'E15:E' . $this->firstPageLastRowInTable . ')',
            '=SUMIF(\'ТЭП здания\'!' . 'F14:F' . $this->firstPageLastRowInTable . ',"ИУЦ",\'ТЭП здания\'!' .
            'E15:E' . $this->firstPageLastRowInTable . ')', 'empty', 'empty', '=H' . $row . '+1.6*I' . $row .
            '+1.3*J' . $row . '+2*K' . $row . '+3*L' . $row . '+1.5*M' . $row . '+4*N' . $row . '',
            '=IF(D' . $row . '=1,O' . $row . ',0)', '=IF(D' . $row . '=2,O' . $row . ',0)', '=IF(D' . $row . '=3,O' . $row . ',0)',
            '=G' . $row . '*P' . $row, '=G' . $row . '*Q' . $row, '=G' . $row . '*R' . $row,
            $this->getBuildingsWithEquipmentFieldValue('proj')
        );
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array('empty', 'empty',
            'ИТОГО', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', '=SUM(S20:S' . $this->excelRowCursor . ')',
            '=SUM(T20:T' . $this->excelRowCursor . ')', '=SUM(U20:U' . $this->excelRowCursor . ')'),
            null, null);
    }

    private function createSecondPageItogRabochieHead()
    {
        $this->spreadsheet->createSheet();
        $this->sheet = $this->spreadsheet->setActiveSheetIndex(1);
        $this->sheet->setTitle('Итог рабочие');
        $this->excelRowCursor = 1;
        $this->sheet->getColumnDimension('A')->setWidth(6);
        $this->sheet->getColumnDimension('B')->setWidth(46);
        $this->sheet->getColumnDimension('C')->setWidth(25);
        $this->sheet->getColumnDimension('D')->setWidth(12);
        $this->sheet->getColumnDimension('E')->setWidth(10);
        $this->sheet->getColumnDimension('F')->setWidth(10);
        $this->sheet->getColumnDimension('G')->setWidth(58);
        $this->sheet->getColumnDimension('H')->setWidth(10);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'УТВЕРЖДАЮ');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'Начальник филиала');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', '"Управление автоматизации и МО"');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'ООО "Газпром добыча Ямбург"');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', '_____________С.И. Гункин');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, null);
        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', '"____" ____________' . date("Y") . ' г.');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData,
            null, null);
        $this->excelRowCursor++;
        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':G' . $this->excelRowCursor);
        $styleArray = [
            'font' => [
                'bold' => true,
            ],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,]];
        $rowsData = array('Технико-экономические показатели для расчета нормативной численности рабочих ЦПС',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);
        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':G' . $this->excelRowCursor);
        $this->excelRowCursor++;

        $rowsData = array('№ ТЭП', 'Наименование структурного подразделения, работ, профессии',
            'Наименование оборудования', 'ед.изм.', 'empty', 'Фактическое значение', 'Основание');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);
        $rowsData = array('empty', 'empty', 'empty', 'единица', 'наименование',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);

        $this->sheet->mergeCells('A10:A11');
        $this->sheet->mergeCells('B10:B11');
        $this->sheet->mergeCells('C10:C11');
        $this->sheet->mergeCells('D10:E10');
        $this->sheet->mergeCells('F10:F11');
        $this->sheet->mergeCells('G10:G11');

        $this->sheet->getStyle('A10:G11')->getBorders()->getAllBorders()
            ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,],
            'font' => [
                'bold' => false,
            ],
        ];
        $this->sheet->getStyle('A10:G11')->applyFromArray($styleArray);

        $this->sheet->getRowDimension('10')->setRowHeight(46);
        $this->sheet->getRowDimension('11')->setRowHeight(46);

        $rowsData = array('1', '2', '3', '4', '5', '6', '7',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null,
            $styleArray);
        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':G' . $this->excelRowCursor);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array(
            'Технико-экономические показатели для расчета нормативной численности рабочих ЦПС',), null,
            $styleArray);
        $this->sheet->mergeCells('A' . $this->excelRowCursor . ':G' . $this->excelRowCursor);
//        $this->getBuildingsWithEquipmentFieldValue('area');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, array(
            'Участок пожарной сигнализации ПС ' . $this->getBuildingsWithEquipmentFieldValue('area'),), null,
            $styleArray);

    }

    private function createSecondPageItogRabochieBody()
    {
        $styleArray = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,],
            ],
            'alignment' => ['wrapText' => true, 'shrinkToFit' => true,
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,],
        ];

        $this->buildingsWithEquipment = BuildEquipController::getBuildingWithEquipmentByBuildingId([
            ['buildings.id', '=', $this->idBuilding], ['kind_signal', '=', 'ИД']]);

        $buildingNameWithGroup = $this->getBuildingsWithEquipmentFieldValue('group_1') . " " .
            $this->getBuildingsWithEquipmentFieldValue('group_2') . " " .
            $this->getBuildingsWithEquipmentFieldValue('shed');


        $formulaID = '=SUMIF(\'ТЭП здания\'!' . 'F14:F' . $this->firstPageLastRowInTable . ',"ИД",\'ТЭП здания\'!' .
            'E14:E' . $this->firstPageLastRowInTable . ')';

        $fieldNames = array('custom|1', 'custom|' . $buildingNameWithGroup, 'typeWithBrand', 'custom|1', 'measure',
            "custom|" . $formulaID, 'proj');
        $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor, $fieldNames, false,
            null, $styleArray);

        $this->sheet->mergeCells('A15:A' . $this->excelRowCursor - 1);
        $this->sheet->mergeCells('B15:B' . $this->excelRowCursor - 1);
        $this->sheet->mergeCells('D15:D' . $this->excelRowCursor - 1);
        $this->sheet->mergeCells('E15:E' . $this->excelRowCursor - 1);
        $this->sheet->mergeCells('F15:F' . $this->excelRowCursor - 1);
        $this->sheet->mergeCells('G15:G' . $this->excelRowCursor - 1);

        $rowsData = array('empty', 'empty', 'Нормативная численность:', 'empty', 'empty', '=SUM(F15*0.002*1.1*1.1*1.02*0.7)', 'чел.',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);
    }

    public function checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry): bool
    {
        return false;
    }
}
