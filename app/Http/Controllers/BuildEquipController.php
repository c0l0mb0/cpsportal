<?php

namespace App\Http\Controllers;

use App\Models\BuildEquip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BuildEquipController extends Controller


{
    private $workerChangesLog = NULL;

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
        $userRole = Auth::user()->roles->pluck('name')[0];

        $equipmentInBuilding = BuildEquip::create($request->all());
        if ($userRole != 'super-user' and $userRole != 'Nur_master' and $userRole != 'Yamburg_master' and
            $userRole != 'Zapolyarka_master') {
            BuildEquip::where('id', $equipmentInBuilding->id)->update(['created_by_worker' => true]);
        }
        return response()->json($equipmentInBuilding);
    }

    public function update($id, Request $request)
    {
        $this->validate($request, [
            'id_build' => 'required',
            'id_equip' => 'required',
            'quantity' => 'required|numeric|min:0|not_in:0',
            'measure' => 'required',
        ]);
        $buildingAndEquip = BuildEquip::findOrFail($id);
        $userRole = Auth::user()->roles->pluck('name')[0];
        if ($userRole != 'super-user' and $userRole != 'Nur_master' and $userRole != 'Yamburg_master' and
            $userRole != 'Zapolyarka_master' and BuildEquip::where('created_by_worker', true)
                ->where('id', $id)->doesntExist()) {
            $this->createWorkerChangesLog();
            $this->workerChangesLog->logUpdatedItem($id, $buildingAndEquip->id_build, $buildingAndEquip->id_equip,
                $buildingAndEquip->quantity, $buildingAndEquip->measure, $buildingAndEquip->equip_year,
                $buildingAndEquip->equip_comments,);
            BuildEquip::where('id', $id)->update(['edited_by_worker' => true]);
        }

        $buildingAndEquip->update($request->all());

        return response()->json($buildingAndEquip);
    }

    public function copyEquipmentFromFromOneBuildingToAnother(Request $request)
    {
        $this->validate($request, [
            'id_build_from' => 'required',
            'id_build_to' => 'required',
        ]);
        DB::statement('INSERT INTO public.build_equip (id_build, id_equip, quantity, measure, equip_year,
                                cel_january, cel_january_gray, cel_february, cel_february_gray, cel_march,
                                cel_march_gray, cel_april, cel_april_gray, cel_may, cel_may_gray, cel_june,
                                cel_june_gray, cel_july, cel_july_gray, cel_august, cel_august_gray, cel_september,
                                cel_september_gray, cel_october, cel_october_gray, cel_november, cel_november_gray,
                                cel_december, cel_december_gray)
                            SELECT :id_build_to,id_equip, quantity, measure, equip_year,
                            cel_january, cel_january_gray, cel_february, cel_february_gray, cel_march, cel_march_gray,
                            cel_april, cel_april_gray, cel_may, cel_may_gray, cel_june, cel_june_gray, cel_july,
                             cel_july_gray, cel_august, cel_august_gray, cel_september, cel_september_gray, cel_october,
                              cel_october_gray, cel_november, cel_november_gray, cel_december, cel_december_gray
                              FROM build_equip
                              WHERE id_build =:id_build_from', ['id_build_to' => $request->id_build_to,
            'id_build_from' => $request->id_build_from]);
        return response()->json('Equipment has been copied successfully');
    }

    private function createWorkerChangesLog()
    {
        if ($this->workerChangesLog === NULL) {
            $this->workerChangesLog = new WorkerDataChangesController();
        }
    }

    public function destroy($id)
    {
        $userRole = Auth::user()->roles->pluck('name')[0];
        $equipment = BuildEquip::find($id);
        if ($userRole === 'super-user' or $userRole === 'Nur_master' or $userRole === 'Yamburg_master' or
            $userRole === 'Zapolyarka_master') {

            $equipment->delete();
            return response()->json('Equipment in building removed successfully');
        }
        if (BuildEquip::where('created_by_worker', true)->where('id', $id)->doesntExist()) {
            $this->createWorkerChangesLog();
            $this->workerChangesLog->logDeletedItem($equipment);
            $equipment->delete();
            return response()->json('Equipment in building removed successfully and logged');
        }
        return response()->json('Equipment that created by worker is deleted');
    }

    public static function getBuildingsWhereEquipmentItemIsUsed($id)
    {
        $buildings = DB::table('build_equip')
            ->select(DB::raw('*, equipment.id as id'))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->where('equipment.id', $id)
            ->orderBy('build_equip.id', 'asc')
            ->get();
        return response()->json($buildings);
    }

    //    excel export DAO
    public static function getBuildingWithEquipmentByBuildingId($whereArr)
    {
        return DB::table('build_equip')
            ->select(DB::raw("*, build_equip.id as id,equip_name,
             CONCAT  (quantity, ' ', measure) AS \"quantityWithMeasure\""))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->orderByRaw("array_position(ARRAY['ППК, и его переферия', 'Извещатель', 'Оповещатель', 'Лучи (шлейфа)',
             'Оборудование КИПиА', 'Пожаротушение', 'Система речевого оповещения', 'Реле', 'Питание', 'КИПиА',
             'Термостат', 'Прочее оборудование', 'Бокс, коробка, щит, шкаф, ящик', 'Кабель'], kind_app), kind_app")
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
            ->where([['area', '=', 'ГП'], ['kind_app', '=', 'Извещатель']])
            ->orWhere([['area', '=', 'Ямбург'], ['kind_app', '=', 'Извещатель']])
            ->groupBy('equip_name', 'equip_name_extracted_type', 'equip_name_extracted_brand', 'brand_name')
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

    public static function getBuildingsWithEquipmentAllData()
    {
        return DB::table('build_equip')
            ->select(DB::raw("affiliate, area , group_1, group_2, shed, queue,fitt,
             proj,fitt_year,proj_year,equip_master_type, type_aups,to_date,aud_warn_type, on_conserv,
            quantity,measure,equip_year,
            equip_name, kind_app_second,kind_app,to2_new,to2_new,brand_name,consist_proc,primary_sens,srok_slugby"))
            ->leftJoin('equipment', 'equipment.id', '=', 'build_equip.id_equip')
            ->leftJoin('buildings', 'buildings.id', '=', 'build_equip.id_build')
            ->get();
    }


}
