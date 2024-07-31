<?php

namespace App\Http\Controllers;
use App\Models\Exam;

class ExamController extends Controller
{
    public function index()
    {
        $examTable = Exam::orderBy('id', 'asc')->get();
        return response()->json($examTable);
    }

}
