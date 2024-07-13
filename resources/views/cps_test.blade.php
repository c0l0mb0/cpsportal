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

</head>
<body>
<div class="wrapper" >
    <div class="test-options d-flex align-items-center justify-content-center  vh-100 bg-light">
        <div class="form-container col-md-8 mt-5" style=" border-radius: 8px; box-shadow: 1px 1px 1px 1px #d4d4d4, -1px 1px 1px 1px #d4d4d4;border-style: solid; border-color: #fffdfd; border-width: 1px;">
            <div class="question row"  style="border-bottom: solid; border-bottom-color: #d8cccc; border-bottom-width: 1px; margin: 7px 0 7px 0 ;">
                <div class="question-number col-md-auto" style="font-size: large;font-weight: bold;">
                    12
                </div>
                <div class="question-text col" style="font-size: large;font-weight: bold;">
                    В каких случаях оперативный персонал, находящийся на дежурстве можно привлекать к работе в бригаде
                    по наряд-допуску?
                </div>
            </div>

                <div class="answers">
                    <div class="answer2 row">
                        <div class="radio-button col-md-auto d-flex align-items-center justify-content-center" style="margin-left:15px">
                            <input class="form-check-input" type="radio">
                        </div>
                        <div class="answer-text col">
                            При внесении изменений в действующие отраслевые акты в сфере электроэнергетики (для
                            персонала объектов по производству электрической энергии, функционирующих в режиме
                            комбинированной выработки электрической и тепловой энергии, - также в сфере теплоснабжения),
                            являющиеся обязательными для использования в работе и исполнения согласно должностным
                            обязанностям (трудовым функциям) работника.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<script src="{{ asset('js/libs/bootstrap5.min.js') }}"></script>

</body>
</html>
