<?php

namespace App\Http\Controllers;

use App\Models\BuildEquip;
use App\Models\ListStates;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BuildEquipController extends Controller
{
    public function index($id)
    {
        $objectAndEquip = DB::table('build_equip')
            ->select(DB::raw('build_equip.id as id,equip_name, quantity,measure, app_year'))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->where('buildings.id', $id)
            ->orderBy('id', 'asc')
            ->get();
        return response()->json($objectAndEquip);

    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'id_build' => 'required',
            'id_equip' => 'required',
            'quantity' => 'required',
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

}
