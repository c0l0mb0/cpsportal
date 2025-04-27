<?php

namespace App\Http\Controllers;

use App\Models\Buildings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;

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
        $userRole = Auth::user()->roles->pluck('name')[0];

        $buildingsQuery = Buildings::orderBy('area', 'asc')
            ->orderBy('plan_graf_name', 'asc')
            ->orderBy('gr_numb', 'asc');
        if ($userRole !== 'super-user') {
            return response()->json($buildingsQuery->where('maintainer_role', '=', $userRole)->get());
        }
        return response()->json($buildingsQuery->get());
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

    public static function indexPlanGrafReturnArr()
    {
        return DB::table('buildings')
            ->select(DB::raw('plan_graf_name'))
            ->distinct()
            ->where('area', '<>', 'ПС САП')
            ->where('area', '<>', 'Новый Уренгой')
            ->where('area', '<>', 'Ямбург')
            ->orderBy('plan_graf_name', 'asc')
            ->get();
    }

    public static function getMaintanerRoleByPlGraf($plGraf)
    {
        return DB::table('buildings')->where('plan_graf_name', $plGraf)->first();
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

        $maintainerRole = $this->getMaintainerRole($request->area, $request->group_1);
        $building = Buildings::create($request->all());
        Buildings::where('id', '=', $building->id)->update(['maintainer_role' => $maintainerRole]);
        $buildingWithMaintainerRole = Buildings::where('id', '=', $building->id)->first();
        return response()->json($buildingWithMaintainerRole);
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
            ->where(function ($query) {
                $query->where('on_conserv', '=', false)
                    ->orWhereNull('on_conserv');
            })
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

    public static function getAffiliatesByPlGr($plGr)
    {
        return DB::table('buildings')
            ->select(DB::raw('affiliate'))
            ->distinct()
            ->where('plan_graf_name', '=', $plGr)
            ->where(function ($query) {
                $query->where('on_conserv', '=', false)
                    ->orWhereNull('on_conserv');
            })
            ->orderBy('affiliate', 'asc')
            ->get();
    }

    private function getMaintainerRole($areaRequest, $group1Request): string
    {
        $maintainerRolesAreas = array("Новый Уренгой" => "Nur_master", "Ямбург" => "Yamburg_master",
            "ПС САП" => "Zapolyarka_master", "ГП" => "GP");
        $maintainerRolesGp = array("ВЖК-1" => "workerGP1", "ГП-1" => "workerGP1", "ГП-1В" => "workerGP1v",
            "ВЖК-2" => "workerGP2", "ГП-2" => "workerGP2", "ГП-3" => "workerGP3", "ВЖК-4" => "workerGP4",
            "ГП-4" => "workerGP4", "ГП-5" => "workerGP5", "ГП-6" => "workerGP6", "ГП-7" => "workerGP7",
            "ГП-9" => "workerGP9", "ВЖК-9" => "workerGP9", "ГТЭС-15" => "workerGP9", "ВЖК-6" => "workerVGK6");
        $maintainerRole = '';
        foreach ($maintainerRolesAreas as $area => $maintainerRoleArea) {
            if ($area === $areaRequest) {
                $maintainerRole = $maintainerRoleArea;

                break;
            }
        }
        if ($maintainerRole === "GP") {
            foreach ($maintainerRolesGp as $group1gp => $maintainerRoleGp) {
                if ($group1gp === $group1Request) {
                    $maintainerRole = $maintainerRoleGp;
                    break;
                }
            }
        }
        return $maintainerRole;
    }

    public static function getPlanGrArr()
    {
        return DB::table('buildings')
            ->select(DB::raw('plan_graf_name'))
            ->distinct()
            ->get();
    }


}
