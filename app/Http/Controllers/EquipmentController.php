<?php

namespace App\Http\Controllers;


use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class EquipmentController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $equipment = Equipment::orderBy('id', 'asc')->get();
        return response()->json($equipment);

    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'equip_name' => 'required',
            'kind_app' => 'required',
            'kind_app_second' => 'required',
            'kind_signal' => 'required',
        ]);
        $equipment = Equipment::create($request->all());

        return response()->json($equipment);
    }

    public function update($id, Request $request)
    {
        $equipment = Equipment::find($id);
        $equipment->update($request->all());
        return response()->json($equipment);
    }

    public function destroy($id)
    {
        $equipment = Equipment::find($id);
        $equipment->delete();

        return response()->json('Equipment removed successfully');
    }



}
