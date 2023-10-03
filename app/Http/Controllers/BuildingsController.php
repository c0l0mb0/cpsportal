<?php

namespace App\Http\Controllers;

use App\Models\Buildings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BuildingsController extends Controller
{
    public function index()
    {
        $userRole = Auth::user()->roles->pluck('name')[0];

        $buildingsQuery = Buildings::orderBy('area', 'asc')
            ->orderBy('group_1', 'asc')
            ->orderBy('group_2', 'asc')
            ->orderBy('shed', 'asc');

        if ($userRole !== 'super-user') {
            return response()->json($buildingsQuery->where('maintainer_role', '=', $userRole)->get());
        }
        return response()->json($buildingsQuery->get());
    }

    public function getBuildingsAndPlanGrafDataOrderedByPlanGraf()
    {
        $buildings = Buildings::orderBy('area', 'asc')
            ->orderBy('plan_graf_name', 'asc')
            ->orderBy('gr_numb', 'asc')
            ->get();
        return response()->json($buildings);
    }

    public static function getBuildingPlanGrafById($id)
    {
        $building = Buildings::find($id);
        $planGrafName = $building->plan_graf_name;
        $planGrafBuildings = DB::table('buildings')
            ->select('*')
            ->where('plan_graf_name', '=', $planGrafName)
            ->orderBy('gr_numb', 'asc')
            ->get();

        return response()->json($planGrafBuildings);
    }

    public function indexPlanGraf()
    {
        $buildingsPlanGraf = DB::table('buildings')
            ->select(DB::raw('area, plan_graf_name'))
            ->distinct()
            ->orderBy('area', 'asc')
            ->orderBy('plan_graf_name', 'asc')
            ->get();
        return response()->json($buildingsPlanGraf);
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

    public function updateBuildingSequenceOfPlanGraf(Request $request)
    {
        $planGrafName = $request->plan_graf_name;
        foreach ($request->buildingsSequence as $index => $buildId) {
            Buildings::where([['id', '=', $buildId], ['plan_graf_name', '=', $planGrafName]])->update(['gr_numb' => $index + 1]);
        }

        $planGrafBuildings = DB::table('buildings')
            ->select(DB::raw('id, plan_graf_name, gr_numb'))
            ->where('plan_graf_name', '=', $request->plan_graf_name)
            ->orderBy('gr_numb', 'asc')
            ->get();
        return response()->json($planGrafBuildings);
    }

    public function destroy($id)
    {
        $building = Buildings::find($id);
        $building->delete();

        return response()->json('Building removed successfully');

    }

    public static function getBuildingById($id)
    {
        $building = Buildings::find($id);
        return $building->shed;
    }

    public static function getBuildingsOfPlanGrafic($whereArr)
    {
        return DB::table('buildings')
            ->select('*')
            ->where($whereArr)
            ->orderBy('gr_numb', 'asc')
            ->get();
    }

    public static function getAffiliates($whereArr)
    {
        return DB::table('buildings')
            ->select(DB::raw('affiliate'))
            ->distinct()
            ->where($whereArr)
            ->orderBy('affiliate', 'asc')
            ->get();
    }


}
