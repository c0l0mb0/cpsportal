<?php

namespace App\Http\Controllers;


use App\Models\Workers;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class WorkersController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $workers = DB::table('workers')
            ->select(DB::raw('workers.id as id, id_user, fio, tab_nom, worker_position,
             fire_instr_last,fire_instr_next'))
            ->orderBy('workers.id', 'ASC')
            ->get();

        return response()->json($workers);
    }
    public function indexWorkersWithOneWeekToExam()
    {
        return response()->json("123");
    }

    public function addSixMonthFromLastDateToNextDate(Request $request)
    {
        $lastCheckDateString = $request->fire_instr_last;
        if ($lastCheckDateString == null) {
            return response()->json('empty fire_instr_last date');
        }
        $lastCheckDateFormatedAsDate = new DateTime($lastCheckDateString);
        $lastCheckDateFormatedAsDate->format('Y-m-d');
        $lastCheckDateFormatedAsDate->modify('+6 month');
        $lastCheckDateTimeStamp = $lastCheckDateFormatedAsDate->getTimestamp();

        $workersId = $request->id;
        $workerNextCheckDayLetter = $this->getLetterFromCpsSchedule($workersId, $lastCheckDateTimeStamp);

        if ($workerNextCheckDayLetter !== "11" && $workerNextCheckDayLetter !== "10" && $workerNextCheckDayLetter !== null) {
            $watchDog = 62;
            while ($workerNextCheckDayLetter !== "11" && $workerNextCheckDayLetter !== "10" && $watchDog !== 0) {
                --$watchDog;
                $lastCheckDateFormatedAsDate->modify('-1 day');
                $workerNextCheckDayLetter = $this->getLetterFromCpsSchedule($workersId, $lastCheckDateFormatedAsDate->getTimestamp());
            }
        }

        $workers = Workers::find($workersId);
        $workers->fire_instr_next = $lastCheckDateFormatedAsDate;
        $workers->save();
    }

    private function getLetterFromCpsSchedule($idWorker, $lastCheckDateTimeStamp)
    {
        $lastCheckDateMonth = date("M", $lastCheckDateTimeStamp);
        $lastCheckDateDay = date("j", $lastCheckDateTimeStamp);
        $lastCheckDateYear = date("Y", $lastCheckDateTimeStamp);

        $tableName = '';

        if ($lastCheckDateYear == 2022) {
            $tableName = 'cps_schedule_2022';
        }
        if ($lastCheckDateYear == 2023) {
            $tableName = 'cps_schedule_2023';
        }
        if ($tableName == '') {
            return null;
        }

        $fieldMonthAndDayName = lcfirst($lastCheckDateMonth) . '_' . $lastCheckDateDay;

        $workerSchedule = DB::table($tableName)->select(DB::raw('id,tab_nom, id_worker, ' . $fieldMonthAndDayName))
            ->where('id_worker', $idWorker)->get();
        if ($workerSchedule == null) {
            return null;
        }

        return $workerSchedule[0]->$fieldMonthAndDayName;
    }

    public function create(Request $request)
    {
        $workers = Workers::create($request->all());

        return response()->json($workers);
    }


    public function update($id, Request $request)
    {
        $workers = Workers::find($id);

        $workers->update($request->all());

        return response()->json($workers);
    }

    public function destroy($id)
    {
        $workers = Workers::find($id);
        $workers->delete();

        return response()->json('worker removed successfully');
    }


}
