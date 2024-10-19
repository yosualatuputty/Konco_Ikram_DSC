<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Stat_DrowsyController extends Controller
{
    public function index()
    {
        return view('statistics-drowsy');
    }

    public function worker()
    {
        return view('statistics-drowsy-worker');
    }
}
