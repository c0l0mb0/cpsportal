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
<div class="form-container col-md-8 mt-5" style="max-width: 900px;">

    <div class="row p-2">
        <div class="col-3">
            <label for="area" class="col-form-label">Кто утвердит (Деревянных в первую
                очередь)</label>
        </div>
        <div class="col-9">
            <select class="form-control" id="area" required name="area">
                <option value="О.Л. Деревянных" selected>О.Л. Деревянных</option>
                <option value="А.А. Турбин">А.А. Турбин</option>
                <option value="С.И. Гункин">С.И. Гункин</option>
            </select>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-3">
            <label for="area" class="col-form-label">Участок</label>
        </div>
        <div class="col-9">
            <select class="form-control" id="area" required name="area">
                <option value="ГП" selected>ГП</option>
                <option value="Ямбург">Ямбург</option>
            </select>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-3">
            <label for="group_1" class="col-form-label">Группа</label>
        </div>
        <div class="col-9">
            <select class="form-control" id="group_1" required name="group_1">
            </select>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-3">
            <label for="group_2" class="col-form-label">Подгруппа</label>
        </div>
        <div class="col-9">
            <select class="form-control" id="group_2" required name="group_2">
            </select>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-3">
            <label for="shed" class="col-form-label">Здание</label>
        </div>
        <div class="col-9">
            <input type="text" class="form-control" id="shed" required name="shed">
        </div>
    </div>
    <div class="row p-2">
        <div class="col-3">
            <label for="act-investigate-date" class="col-form-label">Дата</label>
        </div>
        <div class="col-9">
            <input type="date" class="form-control" id="act-investigate-date" name="act-investigate-date"
                   min="2023-01-01"> </input>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-3">
            <label for="act-investigate-time" class="col-form-label">Время</label>
        </div>
        <div class="col-9">
            <input type="time" class="form-control" id="act-investigate-time" name="act-investigate-time"> </input>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-3">
            <label for="act-investigate-external-signs" class="col-form-label">Что видим? Запись в журн. АРМ, либо
                внешняя неисправность элемента итд</label>
        </div>
        <div class="col-9">
            <textarea class="form-control" id="act-investigate-external-signs"
                      name="act-investigate-external-signs"> </textarea>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-3">
            <label for="act-investigate-short-description" class="col-form-label">Описание одним предложением</label>
        </div>
        <div class="col-9">
            <textarea class="form-control" id="act-investigate-short-description"
                      name="act-investigate-short-description"> </textarea>
        </div>
    </div>

    <div class="act-investigate-full-description-hint m-2">
        <label for="act-investigate-full-description" class="col-form-label">Полное описание поломки. Что измерели? Что
            обнаружили? Что предприняли? Был заменен из ЗИП(ОС)? Указать позиционное обозначение, серийник. Если надо, в
            конце - ... были
            переданы в ЦОиР КТС для
            диагностики и ремонта</label>
    </div>
    <div class="col-12 p-2">
            <textarea class="form-control" id="act-investigate-full-description"
                      name="act-investigate-full-description"> </textarea>
    </div>

    <div class="act-investigate-immediately-actions-hint m-2">
        <label for="act-investigate-immediately-actions" class="col-form-label">Оперативные меры. Если что-то
            заменили, то указать. Если тут же починили, то осавить пустым</label>
    </div>
    <div class="col-12 p-2">
            <textarea class="form-control" id="act-investigate-immediately-actions"
                      name="act-investigate-immediately-actions"></textarea>
    </div>
    <div class="act-investigate-prevent-actions-hint m-2">
        <label for="act-investigate-prevent-actions" class="col-form-label">Мероприятия по устранению причины и
            последствий отказа. Указать что сделали(Отправили элемент в ЦОиР)</label>
    </div>
    <div class="col-12 p-2">
            <textarea class="form-control" id="act-investigate-prevent-actions"
                      name="act-investigate-prevent-actions"></textarea>
    </div>

    <div class="row p-2">
        <div class="col-2">
            <label for="act-investigate-commission-memb-1" class="col-form-label">Коммисся ФИО1</label>
        </div>
        <div class="col-3">
            <input class="form-control" id="act-investigate-commission-memb-1"
                   name="act-investigate-commission-memb-1"> </input>
        </div>
        <div class="col-2">
            <label for="act-investigate-commission-memb-1-occupation" class="col-form-label">Должность</label>
        </div>
        <div class="col-5">
            <select class="form-control" id="act-investigate-commission-memb-1-occupation" required
                    name="act-investigate-commission-memb-1-occupation">
                <option value="слесарь КИПиА, ф.УАиМО ЦПС на ГП" selected>слесарь КИПиА, ф.УАиМО ЦПС на ГП</option>
                <option value="электромантер ОПС, ф.УАиМО ЦПС на ГП">электромантер ОПС, ф.УАиМО ЦПС на ГП</option>
                <option value="инженер-электроник,  ф.УАиМО ЦПС на ГП">инженер-электроник, ф.УАиМО ЦПС на ГП</option>
                <option value="инженер КИПиА, ф.ГПУ">инженер КИПиА, ф.ГПУ</option>
                <option value="инженер КИПиА, ф.ГПУ">инженер по ЭОГО, ф.ГПУ</option>
            </select>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-2">
            <label for="act-investigate-commission-memb-2" class="col-form-label">Коммисся ФИО2</label>
        </div>
        <div class="col-3">
            <input class="form-control" id="act-investigate-commission-memb-2"
                   name="act-investigate-commission-memb-2"> </input>
        </div>
        <div class="col-2">
            <label for="act-investigate-commission-memb-2-occupation" class="col-form-label">Должность</label>
        </div>
        <div class="col-5">
            <select class="form-control" id="act-investigate-commission-memb-2-occupation" required
                    name="act-investigate-commission-memb-2-occupation">
                <option value="слесарь КИПиА, ф.УАиМО ЦПС на ГП" selected>слесарь КИПиА, ф.УАиМО ЦПС на ГП</option>
                <option value="электромантер ОПС, ф.УАиМО ЦПС на ГП">электромантер ОПС, ф.УАиМО ЦПС на ГП</option>
                <option value="инженер-электроник,  ф.УАиМО ЦПС на ГП">инженер-электроник, ф.УАиМО ЦПС на ГП</option>
                <option value="инженер КИПиА, ф.ГПУ">инженер КИПиА, ф.ГПУ</option>
                <option value="инженер КИПиА, ф.ГПУ">инженер по ЭОГО, ф.ГПУ</option>
            </select>
        </div>
    </div>
    <div class="row p-2">
        <div class="col-2">
            <label for="act-investigate-commission-memb-3" class="col-form-label">Коммисся ФИО2</label>
        </div>
        <div class="col-3">
            <input class="form-control" id="act-investigate-commission-memb-3"
                   name="act-investigate-commission-memb-3"> </input>
        </div>
        <div class="col-2">
            <label for="act-investigate-commission-memb-3-occupation" class="col-form-label">Должность</label>
        </div>
        <div class="col-5">
            <select class="form-control" id="act-investigate-commission-memb-3-occupation" required
                    name="act-investigate-commission-memb-3-occupation">
                <option value="слесарь КИПиА, ф.УАиМО ЦПС на ГП" selected>слесарь КИПиА, ф.УАиМО ЦПС на ГП</option>
                <option value="электромантер ОПС, ф.УАиМО ЦПС на ГП">электромантер ОПС, ф.УАиМО ЦПС на ГП</option>
                <option value="инженер-электроник,  ф.УАиМО ЦПС на ГП">инженер-электроник, ф.УАиМО ЦПС на ГП</option>
                <option value="инженер КИПиА, ф.ГПУ">инженер КИПиА, ф.ГПУ</option>
                <option value="инженер КИПиА, ф.ГПУ">инженер по ЭОГО, ф.ГПУ</option>
            </select>
        </div>
    </div>


</div>


<script src="{{ asset('js/libs/bootstrap5.min.js') }}"></script>

</body>
</html>
