<?php

namespace App\Http\Controllers;


use App\Models\BuildEquip;
use App\Models\Equipment;
use App\Models\WorkerDataChanges;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class WorkerDataChangesController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return \Illuminate\Http\JsonResponse
     */


    public function logUpdatedItem($id_build_equip, $id_build, $id_equip, $quantity, $measure, $equip_year, $equip_comments)
    {
        $equipmentInBuildingUpdatedByWorker = NULL;
        if (WorkerDataChanges::where('id_build_equip', $id_build_equip)->doesntExist()) {
            $equipmentInBuildingUpdatedByWorker = WorkerDataChanges::create(['id_build_equip' => $id_build_equip,
                'id_build' => $id_build, 'id_equip' => $id_equip, 'quantity' => $quantity,
                'measure' => $measure, 'equip_year' => $equip_year, 'equip_comments' => $equip_comments]);
            WorkerDataChanges::where('id', $equipmentInBuildingUpdatedByWorker->id)->update(['equip_updated' => true]);

        }
    }

    public function logDeletedItem($equipmentEntry)
    {
        WorkerDataChanges::create(['id_build_equip' => $equipmentEntry->id,
            'id_build' => $equipmentEntry->id_build, 'id_equip' => $equipmentEntry->id_equip,
            'quantity' => $equipmentEntry->quantity, 'measure' => $equipmentEntry->measure,
            'equip_year' => $equipmentEntry->equip_year, 'equip_comments' => $equipmentEntry->equip_comments,
            'cel_january' => $equipmentEntry->cel_january, 'cel_january_gray' => $equipmentEntry->cel_january_gray,
            'cel_february' => $equipmentEntry->cel_february, 'cel_february_gray' => $equipmentEntry->cel_february_gray,
            'cel_march' => $equipmentEntry->cel_march, 'cel_march_gray' => $equipmentEntry->cel_march_gray,
            'cel_april' => $equipmentEntry->cel_april, 'cel_april_gray' => $equipmentEntry->cel_april_gray,
            'cel_may' => $equipmentEntry->cel_may, 'cel_may_gray' => $equipmentEntry->cel_may_gray,
            'cel_june' => $equipmentEntry->cel_june, 'cel_june_gray' => $equipmentEntry->cel_june_gray,
            'cel_july' => $equipmentEntry->cel_july, 'cel_july_gray' => $equipmentEntry->cel_july_gray,
            'cel_august' => $equipmentEntry->cel_august, 'cel_august_gray' => $equipmentEntry->cel_august_gray,
            'cel_september' => $equipmentEntry->cel_september, 'cel_september_gray' => $equipmentEntry->cel_september_gray,
            'cel_october' => $equipmentEntry->cel_october, 'cel_october_gray' => $equipmentEntry->cel_october_gray,
            'cel_november' => $equipmentEntry->cel_november, 'cel_november_gray' => $equipmentEntry->cel_november_gray,
            'cel_december' => $equipmentEntry->cel_december, 'cel_december_gray' => $equipmentEntry->cel_december_gray,
            'equip_deleted' => true]);

    }


}
