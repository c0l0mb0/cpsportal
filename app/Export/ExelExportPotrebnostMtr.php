<?php

namespace App\Export;

use App\Http\Controllers\BuildingsController;
use App\Export;
use App\Http\Controllers\cpsStuffController;


class ExelExportPotrebnostMtr extends ExcelExport
{
    function __construct()
    {
        parent::__construct('потребности_МТР.xlsx', 1, 1);
    }

    public function createHead()
    {
        $rowsData = array('№ п/п', 'Филиал заявитель', 'Идентификационный номер  позиции из принятой УМТСиК зявки на 2024 год
(уникальные номера принятых к поставке позиций будут направлены филиалом УМТСиК в СП после присвоения в рамках заявочной кампании)',
            'Причина отсуствия в заявке', 'Потребность по проекту СТО на 2024 год', 'empty', 'empty', 'empty', 'empty',
            'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'Примечание (для пояснений расчетов при определении потребности)',
            'Предложения (для предложений по изменению СТО в случае наличия)',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $rowsData = array('empty', 'empty', 'empty', 'empty',
            'Пункт СТО(если таблица, номер таблицы и номер пункта или строки из таблицы)', 'Номер страницы СТО',
            'Основное оборудование (транспортное средство, двигатель, и т.п. при наличии в расчете СТО)', 'База расчета/ Объем работ
(по СТО: операция, машино-часы, ТО, и т.п. )', 'empty', 'empty', 'Наименование материала', 'Норма по СТО',
            'Потребность по СТО', 'empty', 'Цена за ед. продукции (в руб. без НДС)', 'Общая стоимость (в руб. без НДС)',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $rowsData = array('empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'Наименование', 'Ед. изм.', 'Кол-во', 'empty', 'empty', 'Ед. изм.', 'Кол-во');
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $rowsData = array('1', '2', '3', '4', '5', '6', '7',
            '8', '9', '10', '11', '12', '13', '14', '15',
            '16', '17', '18',);
        $this->insertJustTextDataInRow($this->excelRowCursor, $this->excelColumnCursor, $rowsData, null, null);

        $this->sheet->getStyle('A1:R4')
            ->getAlignment()->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
        $this->sheet->getStyle('A1:R4')
            ->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
        $this->sheet->getStyle('A1:R4')->getAlignment()->setWrapText(true);

        $this->sheet->getRowDimension('1')->setRowHeight(25);
        $this->sheet->getRowDimension('2')->setRowHeight(65);
        $this->sheet->getRowDimension('3')->setRowHeight(46);
        $this->sheet->getRowDimension('4')->setRowHeight(16);

        $this->sheet->mergeCells('A1:A3');
        $this->sheet->mergeCells('B1:B3');
        $this->sheet->mergeCells('C1:C3');
        $this->sheet->mergeCells('D1:D3');
        $this->sheet->mergeCells('E1:P1');
        $this->sheet->mergeCells('E2:E3');
        $this->sheet->mergeCells('F2:F3');
        $this->sheet->mergeCells('G2:G3');
        $this->sheet->mergeCells('H2:J2');
        $this->sheet->mergeCells('K2:K3');
        $this->sheet->mergeCells('L2:L3');
        $this->sheet->mergeCells('M2:N2');
        $this->sheet->mergeCells('O2:O3');
        $this->sheet->mergeCells('P2:P3');
        $this->sheet->mergeCells('Q1:Q3');
        $this->sheet->mergeCells('R1:R3');

        $letters = range('A', 'R');
        foreach ($letters as $letter) {
            $this->sheet->getColumnDimension($letter)->setWidth(15);
        }
        $this->sheet->getColumnDimension('K')->setWidth(70);
        $this->sheet->getColumnDimension('B')->setWidth(25);

        $this->sheet->getStyle('A1:R4')->getBorders()->getAllBorders()
            ->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);
    }

    public function createBody()
    {
        $this->affiliates = BuildingsController::getAffiliates([['area', '!=', 'ПС САП']]);

        foreach ($this->affiliates as $affiliate) {
            foreach ($this->areas as $area) {
                $this->buildingsWithEequipment = BuildingsController::getBuildingsWithEquipmentGruppedWithSum([['area', '=', $area],
                    ['affiliate', '=', $affiliate->affiliate], ['quantity', '!=', 0]]);

                $fieldNames = array('empty', 'affiliate', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
                    'measure', 'quantity', 'equip_name', 'calculateNormCTO', 'measure',
                    'custom|=ROUNDUP(L&formulaRow*J&formulaRow,0)', 'empty', 'empty', 'empty', 'empty', 'area');
                $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor,
                    $fieldNames, false, null, null);

            }
        }
        $this->buildingsWithEequipment = cpsStuffController::index();
        $fieldNames = array('empty', 'custom|УАиМО', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
            'measure', 'quantity', 'stuff_name', 'calculateNormCTO', 'measure',
            'custom|=ROUNDUP(L&formulaRow*J&formulaRow,0)', 'empty', 'empty', 'empty', 'empty', 'custom|Ямбург');
        $this->insertTableChunk($this->excelRowCursor, $this->excelColumnCursor,
            $fieldNames, false, null, null);
    }

    public function checkAdditionalFieldConditionals($fieldName, $fieldPipeSeparated, $buildingsWithEquipmentEntry): bool
    {
        if ($fieldName == 'calculateNormCTO' and $buildingsWithEquipmentEntry->is_accum !=='TRUE') {
            $F = 0.97;
            $H = floatval($buildingsWithEquipmentEntry->quantity);
            $K = 1 - $F;
            $L = 1.0 / (2.0 * $H);
            $M = 2 * sqrt($F * $K / $H);
            $I = 0;
            if ($H < 9) {
                $I = $K + $L + $M;
            } else {
                $I = $K + $M;
            }
            $J = round($H * $I, 0);

            $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], strval($J));
            $this->excelColumnCursor++;
            return true;
        }
        if ($fieldName == 'calculateNormCTO' and $buildingsWithEquipmentEntry->is_accum ==='TRUE') {
            $accumFactor = 0.18;
            $quantity = floatval($buildingsWithEquipmentEntry->quantity);
            $this->sheet->setCellValue([$this->excelColumnCursor, $this->excelRowCursor], strval(ceil($accumFactor * $quantity)));
            $this->excelColumnCursor++;
            return true;
        }
        return false;
    }
}
