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
        $equipment = Equipment::orderBy('kind_app', 'asc')
            ->orderBy('kind_app_second', 'asc')
            ->orderBy('equip_name', 'asc')
            ->get();
        return response()->json($equipment);

    }

    public function create(Request $request)
    {
        $this->validate($request, [
            'id_equip' => 'required',
            'equip_name' => 'required',
            'brand_name' => 'required',
        ]);
        $equipment = Equipment::find($request->id_equip);
        $equipment->equip_name = $request->equip_name;
        $equipment->brand_name = $request->brand_name;
        $equipment->equip_name_extracted_type = null;
        $equipment->equip_name_extracted_brand = null;

        $equipment = Equipment::create($equipment->toArray());

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
