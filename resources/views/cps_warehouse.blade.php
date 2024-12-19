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

    <link rel="stylesheet" href="{{ asset('css/libs/bootstrap5.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/portal/table.css') }}">

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
                <div class="sidebar-list_capture">Склад</div>
                <li>
                    <a class="sidebar__warehouse-workers sidebar-list-left_margin" href="#">Работники</a>
                </li>
                <li>
                    <a class="sidebar__warehouse-reminders sidebar-list-left_margin" href="#">Остатки</a>
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
                    <button type="button" class="btn new-table-row action-menu-btn" data-bs-toggle="modal"
                            title="Добавить" data-bs-target="#modal__new-entry">
                        <img src="{{ asset('icon/plus-svgrepo-com.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn edit-table-row action-menu-btn" data-bs-toggle="modal"
                            title="Изменить" data-bs-target="#modal__new-entry">
                        <img src="{{ asset('icon/edit-svgrepo-com.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn delete-table-row action-menu-btn" data-bs-toggle="modal"
                            data-bs-target="#modal__confirm-delete-entry" data-bs-placement="bottom" title="Удалить">
                        <img src="{{ asset('icon/trash.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn excel-export action-menu-btn" data-bs-toggle="tooltip"
                            data-bs-placement="bottom" title="Экспорт в Excel">
                        <img src="{{ asset('icon/excel.svg') }}" class="row-menue__icon">
                    </button>
                    <button type="button" class="btn import-reminds action-menu-btn" data-bs-placement="bottom"
                            data-bs-toggle="modal" title="Импорт данных из Excel остатки бухгалтерия"
                            data-bs-target="#modal__import-reminds">
                        <img src="{{ asset('icon/import-reminds.svg') }}" class="row-menue__icon">
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
            <!-- Modal -->
            <div class="modal-container">
                <div class="modal fade" id="modal__new-entry" tabindex="-1" aria-labelledby="modal-Label"
                     aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="modal__caption">Добавить</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <form class="modal-form needs-validation" id="form__new-entry">
                                <div class="modal__form__body"></div>
                                <div class="row" style="margin: 0;">
                                    <mark id="form__error" class="inline-block secondary d-none"
                                          style="text-align: center">
                                    </mark>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть
                                    </button>
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
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Вы действительно хотите удалить данную запись?</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary modal__confirm-delete-entry-btn">Удалить
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отменить</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal import file-->
            <div class="modal-container">
                <div class="modal fade" id="modal__import-reminds" tabindex="-1" aria-labelledby="modal-Label"
                     aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="modal__caption">Загрузить Excel файл остатков из
                                    бухгалтерии</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <form method="POST" action="{{'api/import-excel-warehouse-remains'}}"
                                  enctype="multipart/form-data"
                                  class="modal-form needs-validation m-2">
                                @csrf
                                <input type="file" id="myFile" name="excel_import_remains" accept=".xlsx">
                                <button type="submit" class="btn btn-primary">Отправить</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <script src="{{ asset('js/libs/ag-grid-enterprise.min.js') }}"></script>
        <script src="{{ asset('js/libs/bootstrap5.min.js') }}"></script>


        <script src="@php
            {{echo ('js/app/cps_warehouse/' . scandir("js/app/cps_warehouse/")[2]);}}
        @endphp"></script>

</body>
</html>
