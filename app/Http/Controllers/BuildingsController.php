<?php

namespace App\Http\Controllers;

use App\Models\Buildings;
use Illuminate\Http\Request;

class BuildingsController extends Controller
{
    public function index()
    {
        $buildings = Buildings::orderBy('area', 'asc')->orderBy('group_1', 'asc')->orderBy('group_2', 'asc')->orderBy('shed', 'asc')->get();
        return response()->json($buildings);
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
