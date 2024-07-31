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

<div class="questions-ribbon d-flex flex-row">
    <div class="quest-status text-center">
        1
    </div>
    <div class="quest-status text-center">
        2
    </div>
    <div class="quest-status text-center">
        2
    </div>
    <div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div><div class="quest-status text-center">
        2
    </div>
</div>
<div class="question text-center">
    На кого распространяются Правила по охране труда при эксплуатации электроустановок?
</div>
<div class="answers">
    <div class="form-check d-flex">
        <div class="radio-button-wraper d-flex justify-content-md-center align-items-center">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
        </div>
        <div class="quest-text">
            <label class="form-check-answer" for="flexRadioDefault1">
                При внесении изменений в действующие отраслевые акты в сфере электроэнергетики (для
                персонала объектов по производству электрической энергии, функционирующих в режиме
                комбинированной выработки электрической и тепловой энергии, - также в сфере теплоснабжения),
                являющиеся обязательными для использования в работе и исполнения согласно должностным
                обязанностям (трудовым функциям) работника.
            </label>
        </div>
    </div>
    <div class="vertical-space" style="height: 30px"></div>

    <div class="form-check d-flex">
        <div class="radio-button d-flex justify-content-md-center align-items-center">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
        </div>
        <div class="quest-text">
            <label class="form-check-label" for="flexRadioDefault2" style="font-size: 20px; margin-left: 15px;">
                На работников всех организаций независимо от формы собственности, занятых техническим обслуживанием
                электроустановок и выполняющих в них строительные, монтажные и ремонтные работы
            </label>
        </div>
    </div>
    <div class="vertical-space"></div>

    <div class="form-check d-flex">
        <div class="radio-button d-flex justify-content-md-center align-items-center">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3">
        </div>
        <div class="quest-text">
            <label class="form-check-label" for="flexRadioDefault3" style="font-size: 20px;margin-left: 15px;">
                На работников организаций независимо от форм собственности и организационно-правовых форм и других
                физических
                лиц, занятых техническим обслуживанием электроустановок, проводящих в них оперативные переключения,
                организующих и выполняющих испытания и измерения
            </label>
        </div>
    </div>
    <div class="vertical-space" style="height: 30px"></div>
</div>


<div class="d-grid gap-2 col-3 mx-auto">
    <button type="submit" class="btn btn-primary btn-start-test">Ответить</button>
</div>

<script src="{{ asset('js/libs/bootstrap5.min.js') }}"></script>

</body>
</html>
