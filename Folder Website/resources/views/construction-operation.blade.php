@extends('layouts.navbar')

@section('title', 'Construction Operation')

@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel="stylesheet" href="{{ asset('css/medical.css') }}">
<div class="container">
    <h1>Construction Operation</h1>
    <p>Welcome to the Construction Operation page!</p>
    <video id="video" autoplay playsinline></video>
    <canvas id="canvas" style="display: block; border: 1px solid black;"></canvas>
    <button id="toggle-camera">Start Camera</button>
    <div id="results"></div> <!-- Tempat untuk menampilkan hasil deteksi -->
    <p>This page contains all the information related to Construction operations and procedures.</p>
</div>
<script src="{{ asset('js/construction1.js') }}"></script>
<!-- <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script> -->
@endsection
