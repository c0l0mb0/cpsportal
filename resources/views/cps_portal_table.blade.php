<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    {{--    CSRF Token--}}
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Вход</title>

    <link rel="stylesheet" href="{{ asset('css/libs/bootstrap4.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/table/table.css') }}">
    <link rel="stylesheet" href="{{ asset('css/libs/flatpickr.min.css') }}">

</head>
<body>
<div class="wrapper">
    <!-- Sidebar  -->
    <nav id="sidebar" class="sticky-sm-top">
        <div class="sidebar-container">
            <div class="sidebar-header">
                <div class="sidebar__icon">
                    <img src="{{ asset('icon/sensor.png') }}" alt="" aria-hidden="true">
                </div>
            </div>

            <ul class="list-unstyled components">
                <div class="sidebar-list_capture">Оборудование</div>
                <li>
                    <a class="sidebar__edit-equip sidebar-list-left_margin" hidden href="#">Все обрудование</a>
                </li>
                <li>
                    <a class="sidebar__edit-buildings sidebar-list-left_margin" hidden href="#">Здания</a>
                </li>
                <li>
                    <a class="sidebar__edit-equip-in-building sidebar-list-left_margin" hidden href="#">Оборудование в
                        здании</a>
                </li>
                <li>
                    <a class="sidebar__export-reports sidebar-list-left_margin" hidden href="#">Отчеты</a>
                </li>
                <li>
                    <a class="sidebar__edit-plan_grafici sidebar-list-left_margin" hidden href="#">План-графики
                        данные</a>
                </li>
                <li>
                    <a class="sidebar__export-plan_grafici sidebar-list-left_margin" hidden href="#">План-графики
                        экспорт</a>
                </li>
                <div hidden class="sidebar-list_capture ">Персонал</div>
                <li>
                    <a class="sidebar__edit-fire_instr sidebar-list-left_margin" hidden href="#">ПожИнструктаж</a>
                </li>
                <li>
                    <a class="sidebar__edit-staff sidebar-list-left_margin " hidden href="#">Данные</a>
                </li>
            </ul>
        </div>
    </nav>

    <!-- Page Content  -->
    <div id="content">

        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid navbar-container">

                <button type="button" id="sidebarCollapse" class="btn btn-info">
                    <i class="fas fa-align-left"></i>
                    <span>Меню</span>
                </button>
                <div class="row-menue">
                    <button type="button" class="btn new-table-row action-menu-btn" data-toggle="modal"
                            title="Добавить" data-target="#modal__new-entry">
                        <img src="{{ asset('icon/plus-svgrepo-com.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn edit-table-row action-menu-btn" data-toggle="modal"
                            title="изменить прибор" data-target="#modal__new-entry">
                        <img src="{{ asset('icon/edit-svgrepo-com.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn return-back action-menu-btn" data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="вернуться к зданиям">
                        <img src="{{ asset('icon/outer.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn delete-table-row action-menu-btn" data-bs-toggle="tooltip"
                            data-toggle="modal"
                            data-target="#modal__confirm-delete-entry" data-bs-placement="bottom" title="Удалить">
                        <img src="{{ asset('icon/trash.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn plus-six-month action-menu-btn" data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="последний экзамен + 6 месяцев">
                        <img src="{{ asset('icon/plus-six.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn inner-equip action-menu-btn" data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="оборудование">
                        <img src="{{ asset('icon/chip-svgrepo-com.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn excel-export-passport action-menu-btn" data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="Паспорт здания">
                        <img src="{{ asset('icon/passport.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn excel-export-plangrafic action-menu-btn" data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="Экспорт плана-графика">
                        <img src="{{ asset('icon/plangraf.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn excel-inner-month action-menu-btn" data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="Меяцы проверок">
                        <img src="{{ asset('icon/inner-month.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn plangraf-sequence action-menu-btn" data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="Порядок зданий ПлГр">
                        <img src="{{ asset('icon/sequence.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn plangraf-arrange-numbers action-menu-btn" data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="Расставить номера">
                        <img src="{{ asset('icon/arrange-build-plgraf.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn equip-usage action-menu-btn" data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="Где используется">
                        <img src="{{ asset('icon/chart-tree.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn copy-all-building-equipment action-menu-btn"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="копировать оборудование текущего здания"
                            data-toggle="modal" data-target="#modal__new-entry">
                        <img src="{{ asset('icon/copy.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn excel-export action-menu-btn" data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="Экспорт в Excel">
                        <img src="{{ asset('icon/excel.svg') }}" class="row-menue__icon">
                    </button>
                </div>
                <div class="justify-content-end navbar-btn-logout-wrapper">
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <x-dropdown-link :href="route('logout')"
                                         onclick="event.preventDefault();
                                                this.closest('form').submit();">
                            {{ __('выйти') }}
                        </x-dropdown-link>
                    </form>
                </div>

            </div>
        </nav>
        <div id="app">
            <div class='app-container'>
                <div class='page-header'>
                    <h1 id='page-title'></h1>
                </div>
                <div id='page-content'></div>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal-container">
        <div class="modal fade" id="modal__new-entry" tabindex="-1" aria-labelledby="modal-Label" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modal__caption">Добавить</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form class="modal-form needs-validation" id="form__new-entry">
                        <div class="modal__form__body"></div>
                        <div class="row" style="margin: 0;">
                            <mark id="form__error" class="inline-block secondary d-none" style="text-align: center">
                            </mark>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                            <button type="submit" class="btn btn-primary modal__sbmit">Сохранить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal confirm delete-->
    <div class="modal" tabindex="-1" role="dialog" id="modal__confirm-delete-entry">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Удаление</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Вы действительно хотите удалить данную запись?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary modal__confirm-delete-entry-btn">Удалить</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                </div>
            </div>
        </div>
    </div>
</div>


<script src="{{ asset('js/libs/ag-grid-enterprise.min.js') }}"></script>
<script src="{{ asset('js/libs/flatpickr.js') }}"></script>
<script src="{{ asset('js/libs/ru.js') }}"></script>

<script src="{{ asset('js/libs/jquery-3.2.1.slim.min.js') }}"></script>
<script src="{{ asset('js/libs/popper.min.js') }}"></script>
<script src="{{ asset('js/libs/bootstrap4.min.js') }}"></script>


<script src="@php
    {{echo ('js/cps_table/' . scandir("js/cps_table/")[2]);}}
@endphp"></script>

</body>
</html>
