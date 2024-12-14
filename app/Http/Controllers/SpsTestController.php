<?php

namespace App\Http\Controllers;

use App\Models\SpsTest;

class SpsTestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public static function index()
    {
        return SpsTest::orderBy('id')->get();
    }


}
