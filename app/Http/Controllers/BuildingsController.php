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
            ->select(['group_1','group_2', 'area'])
            ->distinct()
            ->orderBy('area', 'asc')
            ->orderBy('group_2', 'asc')
            ->whereNotNull('group_2')
            ->get();
        return response()->json($group2List);
//        $group2List = DB::table('equipment')
//            ->select(['kind_app','kind_app_second'])
//            ->distinct()
//            ->orderBy('kind_app', 'asc')
//            ->orderBy('kind_app_second', 'asc')
//            ->whereNotNull('group_2')
//            ->get();
//        return response()->json($group2List);
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
}
