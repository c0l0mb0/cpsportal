<?php

namespace App\Http\Controllers;
use App\Models\ElectroBezExam;

class ElectroBezExamController extends Controller
{
    public function index()
    {
        $electroBezExamTable = ElectroBezExam::orderBy('id', 'asc')->get();
        return response()->json($electroBezExamTable);
    }

}
