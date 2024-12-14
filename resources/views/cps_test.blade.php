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

    <link rel="stylesheet" href="{{ asset('css/portal/exam.css') }}">

</head>
<body>

<script src="@php
    {{echo ('js/cps_test/' . scandir("js/cps_test/")[2]);}}
@endphp"></script>

</body>
</html>
