<?php

namespace App\Http\Controllers;

use App\Models\Buildings;
use Illuminate\Http\Request;

class BuildingsController extends Controller
{
    public function index()
    {
//        $buildings = CpsBuildings::offset(0)->limit(100)->get();

        $buildings = Buildings::all();
        return response()->json($buildings);
    }

    public function create(Request $request)
    {
//        $this->validate($request, [
//            'inner_name' => 'required',
//            'quant' => 'required',
//            'outer_id' => 'required'
//        ]);
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
