<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    {{-- CSRF Token--}}
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Тестирование</title>

    <link rel="stylesheet" href="{{ asset('css/libs/bootstrap5.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/portal/exam.css') }}">

</head>
<body>
<div class='app-container d-flex justify-content-center'>
    <div class="form-container col-md-8 mt-5  mb-5" style="max-width: 600px;">
        <div id='page-content'></div>
    </div>
</div>

<script src="{{ asset('js/libs/bootstrap5.min.js') }}"></script>
<script src="@php
    {{echo ('js/app/cps_test/' . scandir("js/app/cps_test/")[2]);}}
@endphp"></script>

</body>
</html>
