
@extends('layouts.navbar')

@section('title', 'Statistics Drowsy')

@section('content')
<link rel="stylesheet" href="{{ asset('css/stat.css') }}">

<div class="main-container">
    <div class="container-opt" >
        <div class="dropdown">
            <button>OPERATION</button>
            <div class="dropdown-content">
                <a href="#">Medical</a>
                <a href="#">Manufacture</a>
            </div>
        </div>  <div class="dropdown">
            <button>WORKER ID</button>
            <div class="dropdown-content">
                <a href="/worker">234</a>
                <a href="#">435</a>
                <a href="#">478</a>
            </div>
        </div>  <div class="dropdown">
            <button>DATE</button>
            <div class="dropdown-content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
            </div>
        </div>  
    </div>
    <div class="weekly-chart-container">
        <div class="weekly-text">Weekly Chart (Compliance)</div>
        <div class="weekly-chart">

        </div>
    </div>
    <!-- <div class="counts-container">
        <div class="violation">
            <div class="vio-text">
                Drowsy
            </div>
            <div class="vio-num">
                12
            </div>
        </div>
        <div class="hours">
            <div class="hours-text">
                Avg/Hours
            </div>
            <div class="hours-num">
                12
            </div>
        </div>
        <div class="active">
            <div class="active-text">
                Active Time
            </div>
            <div class="active-num">
                00:00
            </div>
        </div>

    </div> -->
    <div class="charts-container">
        <div class="pie-chart-container">
            <div class="pie-chart-text">
                Drowsyness Detected Chart
            </div>
            <div class="pie-chart">
                Chart goes here
            </div>
        </div>
        <div class="vio-chart-container">
            <div class="vio-chart-text">
                Drowsyness Chart per Division
            </div>
            <div class="vio-chart">
                Chart goes here
            </div>
        </div>
        <div class="worker-chart-container">
            <div class="worker-chart-text">
               Worker Drowsyness Table
            </div>
            <div class="worker-chart">
                Chart goes here
            </div>
        </div>
    </div>
</div>

<div class="activity-timeline-container">
    <div class="activity-timeline-text">Activity Timeline</div>
    <div class="activity-timeline-chart">

    </div>
</div>

<div class="one-hour-container">
    <div class="activity-timeline-text">1 Hour Average</div>
    <div class="one-hour-chart">

    </div>
</div>

{{-- <script src="{{ asset('js/medical.js') }}"></script> --}}
@endsection
