<?php

namespace App\Http\Controllers;

use App\Models\BuildEquip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BuildEquipController extends Controller
{
    public function index($id)
    {
        $buildingAndEquip = DB::table('build_equip')
            ->select(DB::raw('*, build_equip.id as id,equip_name, quantity,measure, equip_year'))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->where('buildings.id', $id)
            ->orderBy('build_equip.id', 'asc')
            ->get();
        return response()->json($buildingAndEquip);

    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'id_build' => 'required',
            'id_equip' => 'required',
            'quantity' => 'required|numeric|min:0|not_in:0',
            'measure' => 'required',
        ]);
        if (BuildEquip::where('id_build', $request->id_build)->where('id_equip', $request->id_equip)->exists()) {
            return response()->json('прибор в этом здании уже существует', 409);
        }
        $equipmentInBuilding = BuildEquip::create($request->all());

        return response()->json($equipmentInBuilding);
    }

    public function update($id, Request $request)
    {
        $this->validate($request, [
            'id_equip' => 'required',
        ]);
        $buildingAndEquip = BuildEquip::findOrFail($id);
        $buildingAndEquip->update($request->all());
        return response()->json($buildingAndEquip);
    }

    public function destroy($id)
    {

        $equipment = BuildEquip::find($id);
        $equipment->delete();

        return response()->json('Equipment in building removed successfully');
    }

    //    excel export DAO
    public static function getBuildingWithEquipmentByBuildingId($whereArr)
    {
        return DB::table('build_equip')
            ->select(DB::raw("*, build_equip.id as id,equip_name,
             CONCAT  (quantity, ' ', measure) AS \"quantityWithMeasure\""))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->orderBy('equip_name', 'asc')
            ->where($whereArr)
            ->get();
    }
    public static function getIzveshatelEquipmentCount()
    {
        return DB::table('build_equip')
            ->select(DB::raw(" equip_name_extracted_type, equip_name_extracted_brand, brand_name,
            CASE WHEN equip_name_extracted_type is NULL THEN equip_name  ELSE equip_name_extracted_type END eqip_name_case,
            SUM(quantity) as quantity"))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->orderBy('equip_name_extracted_type', 'asc')
            ->where([['area','=','ГП'],['kind_app', '=', 'Извещатель']])
            ->orWhere([['area','=','Ямбург'],['kind_app', '=', 'Извещатель']])
            ->groupBy( 'equip_name','equip_name_extracted_type', 'equip_name_extracted_brand','brand_name')
//            ->where('area','=','ГП')
            ->get();
    }
    public static function getBuildingChannelsByBuildingId($whereArr)
    {
        return DB::table('build_equip')
            ->select(DB::raw("buildings.id, SUM (CASE WHEN kind_signal = 'УА' THEN quantity ELSE 0 END) as sum_ua,
            SUM (CASE WHEN kind_signal = 'ИУЦ' THEN quantity ELSE 0 END) as sum_iuc,
            SUM (CASE WHEN kind_signal = 'УД' THEN quantity ELSE 0 END) as sum_ud,
            SUM (CASE WHEN kind_signal = 'ИД' THEN quantity ELSE 0 END) as sum_id,
            SUM (CASE WHEN kind_signal = 'ИА' THEN quantity ELSE 0 END) as sum_ia"))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->where($whereArr)
            ->groupBy('buildings.id')
            ->get();
    }

    public static function getBuildingsWithEquipmentGruppedWithSumWithCaseEquipName($whereArr)
    {
        return DB::table('build_equip')
            ->select(DB::raw(" measure, affiliate,
            equip_name_extracted_brand, SUM(quantity) as quantity, kind_app_second,
            CASE WHEN equip_name_extracted_type is NULL THEN equip_name  ELSE equip_name_extracted_type END eqip_name_case,
            CASE WHEN kind_app_second = 'Аккумулятор' THEN 'TRUE'  ELSE 'FALSE' END is_accum"))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->where($whereArr)
            ->groupBy('equip_name', 'measure', 'affiliate', 'equip_name_extracted_type',
                'equip_name_extracted_brand', 'kind_app_second')
            ->get();
    }

    public static function getBuildingsWithEquipmentGruppedWithSum($whereArr)
    {
        return DB::table('build_equip')
            ->select(DB::raw(" measure, affiliate, area ,equip_name, kind_app_second, SUM(quantity) as quantity,
            CASE WHEN kind_app_second = 'Аккумулятор' THEN 'TRUE'  ELSE 'FALSE' END is_accum"))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->where($whereArr)
            ->groupBy('measure', 'affiliate', 'equip_name', 'area', 'kind_app_second')
            ->get();
    }



}
