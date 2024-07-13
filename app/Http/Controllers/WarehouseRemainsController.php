<?php

namespace App\Http\Controllers;


use App\Models\WarehouseRemains;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class WarehouseRemainsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    private $sheet;

    public function index()
    {
        $warehouseRemains = DB::table('warehouse_remains')
            ->select(DB::raw('*, warehouse_remains.id as id'))
            ->leftJoin('workers', 'workers.id', '=', 'warehouse_remains.id_worker')
            ->get();

        return response()->json($warehouseRemains);
    }

    public function importExcelWarehouseRemains(Request $request)
    {
        $fileName = $request->file('excel_import_remains');
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($fileName);
        $this->sheet = $spreadsheet->setActiveSheetIndex(0);
        $remainsTable = array();
        $remainsAbsentWorkersData = array();
        for ($row = 1; $row <= $this->sheet->getHighestRow(); $row++) {
            $intValue = intval($this->sheet->getCell([2, $row])->getValue());
            if ($intValue !== 0) {
                $remainsTableRow = array();
                $tabNumber = $this->sheet->getCell([2, $row])->getValue();

                $worker = DB::table('workers')->where('tab_nom', $tabNumber)->first();
                if (is_null($worker)) {
                    $absentWorkerData = array();
                    $absentWorkerData['tab_nom'] = $this->sheet->getCell([2, $row])->getValue();
                    $absentWorkerData['fio'] = $this->sheet->getCell([3, $row])->getValue();
                    array_push($remainsAbsentWorkersData, $absentWorkerData);
                    continue;
                }
                $remainsTableRow['id_worker'] = $worker->id;
                $remainsTableRow['siz_item'] = $this->sheet->getCell([6, $row])->getValue();
                $remainsTableRow['posting'] = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject(
                    $this->sheet->getCell([9, $row])->getValue())->format('Y-m-d');
                $remainsTableRow['disposal'] = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject(
                    $this->sheet->getCell([10, $row])->getValue())->format('Y-m-d');
                array_push($remainsTable, $remainsTableRow);

            }
        }
        $remainsAbsentWorkersData = array_unique($remainsAbsentWorkersData, SORT_REGULAR);
        if (sizeof($remainsAbsentWorkersData) > 0) {
            return response(json_encode($remainsAbsentWorkersData), 409) ->header('Content-Type', 'application/json');
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

}
