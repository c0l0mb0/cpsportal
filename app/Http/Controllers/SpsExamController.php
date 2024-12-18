<?php

namespace App\Http\Controllers;

use App\Models\SpsExam;

class SpsExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public static function index()
    {
        return SpsExam::orderBy('id')->get();
    }


}
