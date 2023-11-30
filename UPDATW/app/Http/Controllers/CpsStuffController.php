<?php

namespace App\Http\Controllers;

use App\Models\CpsStuff;
use Illuminate\Http\Request;

class cpsStuffController extends Controller
{
    public static function index()
    {
        return CpsStuff::orderBy('id', 'asc')
            ->get();
    }
}
