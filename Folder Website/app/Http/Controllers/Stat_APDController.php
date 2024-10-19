<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Stat_APDController extends Controller
{
    public function index()
    {
         // Weekly labels (7 days)
         $labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

         // Generate random data for each day of the week
         $data = [];
         for ($i = 0; $i < 7; $i++) {
             $data[] = rand(1, 10); // Random values between 1 and 10
         }

         // Pie Chart
        $labels_pie = ['Compliance', 'Violation'];

        $data_pie = [63, 37];

        // vio chart
        $labels_vio = ['Welder', 'Driver', 'Div 3', 'Div 4'];

        $data_vio = [3, 10, 8, 5]; 

        // Table
         $tableData = [
            ['Worker 1', 'Gloves', '12:00'],
            ['Worker 2', 'Helmet', '12:45'],
            ['Worker 3', 'Mask', '15:00'],
            ['Worker 4', 'Gloves', '16:00'],
        ];

        //Activity Timeline
        $labels_timeline = [];
        $data_timeline = [];

        $time = strtotime('16:49:00');
        for ($i = 0; $i < 10; $i++) {
            $labels_timeline[] = date('H:i:s', $time + ($i * 60));
            $data_timeline[] = rand(0, 5);
        }

        return view('statistics-apd', compact('labels', 'data', 
        'labels_pie', 'data_pie', 'labels_vio', 'data_vio', 'tableData', 'labels_timeline', 'data_timeline'));
        // return view('');
    }

    public function worker()
    {
        return view('statistics-apd-worker');
    }
}
