<?php

namespace App\Http\Controllers;

use App\Models\Buildings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BuildingsController extends Controller
{
    public function index()
    {
        $buildings = Buildings::orderBy('area', 'asc')
            ->orderBy('group_1', 'asc')
            ->orderBy('group_2', 'asc')
            ->orderBy('shed', 'asc')
            ->get();
        return response()->json($buildings);
    }

    public function indexGroup1()
    {
        $group1List = DB::table('buildings')
            ->select(['group_1', 'area'])
            ->distinct()
            ->orderBy('area', 'asc')
            ->orderBy('group_1', 'asc')
            ->get();
        return response()->json($group1List);
    }

    public function indexGroup2()
    {
        $group2List = DB::table('buildings')
            ->select(['group_1', 'group_2', 'area'])
            ->distinct()
            ->orderBy('area', 'asc')
            ->orderBy('group_2', 'asc')
            ->whereNotNull('group_2')
            ->get();
        return response()->json($group2List);
    }

    public function indexAffiliate()
    {
        $affiliateList = DB::table('buildings')
            ->select('affiliate')
            ->distinct()
            ->orderBy('affiliate', 'asc')
            ->get();
        return response()->json($affiliateList);
    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'area' => 'required',
            'group_1' => 'required',
            'shed' => 'required',
            'affiliate' => 'required',
        ]);
        $building = Buildings::create($request->all());

        return response()->json($building);
    }

    public function update($id, Request $request)
    {
        $building = Buildings::find($id);
        $building->update($request->all());
        return response()->json($building);
    }

    public function destroy($id)
    {
        $building = Buildings::find($id);
        $building->delete();

        return response()->json('Building removed successfully');

    }

//    excel export DAO
    public static function getBuildingsWithEquipmentGruppedWithSumWithCaseEquipName($whereArr)
    {
        return DB::table('build_equip')
            ->select(DB::raw(" measure, affiliate,
            equip_name_extracted_brand, SUM(quantity) as quantity, kind_app_second,
            CASE WHEN equip_name_extracted_type is NULL THEN equip_name  ELSE equip_name_extracted_type END eqip_name_case,
            CASE WHEN kind_app_second = 'Аккумулятор' THEN 'TRUE'  ELSE 'FALSE' END is_accum" ))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->where($whereArr)
            ->groupBy('equip_name', 'measure', 'affiliate','equip_name_extracted_type',
                'equip_name_extracted_brand' ,'kind_app_second')
            ->get();
    }

    public static function getBuildingsWithEquipmentGruppedWithSum($whereArr)
    {
        return  DB::table('build_equip')
            ->select(DB::raw(" measure, affiliate, area ,equip_name, kind_app_second, SUM(quantity) as quantity,
            CASE WHEN kind_app_second = 'Аккумулятор' THEN 'TRUE'  ELSE 'FALSE' END is_accum" ))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->where($whereArr)
            ->groupBy('measure', 'affiliate', 'equip_name', 'area','kind_app_second')
            ->get();
    }

    public static function getAffiliates($whereArr)
    {
        return  DB::table('buildings')
            ->select(DB::raw('affiliate'))
            ->distinct()
            ->where($whereArr)
            ->orderBy('affiliate', 'asc')
            ->get();
    }

}
