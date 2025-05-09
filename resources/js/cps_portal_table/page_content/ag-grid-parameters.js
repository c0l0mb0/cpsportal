import {config, httpRequest} from "../cps-portal-dao";
import {addCSRF} from "../helper";
import NumericCellEditor from "./ag_grid_classes/numeric-cell-editor.js";
import {lists} from "../lists";
import CheckboxRenderer from "./ag_grid_classes/check-box-render";
import {userRole} from "../app";
import DateFormatter from "./ag_grid_classes/date-formatter";
import StringDateEditor from "./ag_grid_classes/string-date-editor";
import StyleTimeToExam from "./ag_grid_classes/cellStyleTimeToExam";


export let agGridParameters = {
    agOuterId: undefined,
    actionMenu: undefined,
    warehouseRemainsParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "ФИО",
                    field: "fio",
                    minWidth: 130,
                    tooltipField: 'fio',
                    sortable: true
                },
                {
                    headerName: "N табеля",
                    field: "tab_nom",
                    minWidth: 40,
                    tooltipField: 'tab_nom',
                    sortable: true
                },
                {
                    headerName: "Название ОС",
                    field: "siz_item",
                    minWidth: 40,
                    tooltipField: 'siz_item',
                    sortable: true
                },
                {
                    headerName: "Дата оприходования",
                    field: "posting",
                    minWidth: 40,
                    tooltipField: 'posting',
                    sortable: true
                },
                {
                    headerName: "ЗапланирДатаВыбытия",
                    field: "disposal",
                    minWidth: 40,
                    tooltipField: 'disposal',
                    sortable: true
                },


            ],
            rowSelection: 'single',
            suppressCopyRowsToClipboard: true,
            defaultColDef: {
                resizable: true,
                editable: false,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                // httpRequest(config.api.postPutDeleteWorkers, "PUT", addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'warehouseRemainsParameters',
    },
    cpsScheduleParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "ФИО",
                    field: "fio",
                    minWidth: 130,
                    tooltipField: 'fio',
                    editable: false,
                    sortable: true
                },
                {
                    headerName: "N табеля",
                    field: "tab_nom",
                    minWidth: 40,
                    tooltipField: 'tab_nom',
                    editable: false,
                },
                {
                    headerName: "Должность",
                    field: "worker_position",
                    minWidth: 100,
                    tooltipField: 'worker_position',
                    editable: false,
                },
                {
                    headerName: "Высота",
                    field: "height_next",
                    minWidth: 60,
                    tooltipField: 'height_next',
                    cellEditor: StringDateEditor,
                    valueFormatter: DateFormatter,
                    cellStyle: StyleTimeToExam,
                },
                {
                    headerName: "Электобез",
                    field: "electrobez_next",
                    minWidth: 60,
                    tooltipField: 'electrobez_next',
                    cellEditor: StringDateEditor,
                    valueFormatter: DateFormatter,
                    cellStyle: StyleTimeToExam,
                },
                {
                    headerName: "Медосмотр",
                    field: "medcheck_next",
                    minWidth: 60,
                    tooltipField: 'medcheck_next',
                    cellEditor: StringDateEditor,
                    valueFormatter: DateFormatter,
                    cellStyle: StyleTimeToExam,
                },


            ],
            rowSelection: 'single',
            suppressCopyRowsToClipboard: true,
            defaultColDef: {
                resizable: true,
                editable: true,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.postPutDeleteWorkers, "PUT", addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onCellEditingStarted: function (event) {
                let columnName = event.colDef.field;
                if (columnName.includes('last') === true) {
                    agGridParameters.actionMenu.showPlusSixButton();
                    agGridParameters.actionMenu.showPlusThreeButton();
                    agGridParameters.actionMenu.showPlusTwelveButton();
                }

            },
            onCellEditingStopped: function () {
                agGridParameters.actionMenu.hidePlusSixButton();
                agGridParameters.actionMenu.hidePlusThreeButton();
                agGridParameters.actionMenu.hidePlusTwelveButton();
            },
            onRowSelected: function () {
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'cpsScheduleParameters',
    },
    cpsWarehouseParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "ФИО",
                    field: "fio",
                    minWidth: 130,
                    tooltipField: 'fio',
                    editable: false,
                    sortable: true
                },
                {
                    headerName: "N табеля",
                    field: "tab_nom",
                    minWidth: 40,
                    tooltipField: 'tab_nom',
                    editable: false,
                },
                {
                    headerName: "N табеляСтарый",
                    field: "tab_nom_old",
                    minWidth: 40,
                    tooltipField: 'tab_nom_old',
                    editable: false,
                },
                {
                    headerName: "Должность",
                    field: "worker_position",
                    minWidth: 100,
                    tooltipField: 'worker_position',
                    editable: false,
                },
                {
                    headerName: "ШаблонКарточки",
                    field: "template_card",
                    minWidth: 100,
                    tooltipField: 'template_card',
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Пол",
                    field: "sex",
                    minWidth: 60,
                    tooltipField: 'sex',
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Рост",
                    field: "height",
                    minWidth: 60,
                    tooltipField: 'height',
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Одежда",
                    field: "clothes_size",
                    minWidth: 60,
                    tooltipField: 'clothes_size',
                },
                {
                    headerName: "Обувь",
                    field: "shoes_size",
                    minWidth: 60,
                    tooltipField: 'shoes_size',
                },
                {
                    headerName: "Шапка",
                    field: "hat_size",
                    minWidth: 60,
                    tooltipField: 'hat_size',
                },
                {
                    headerName: "РаботаДатаПоступления",
                    field: "job_start",
                    minWidth: 60,
                    tooltipField: 'job_start',
                },


            ],
            rowSelection: 'single',
            suppressCopyRowsToClipboard: true,
            defaultColDef: {
                resizable: true,
                editable: true,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.postPutDeleteWorkers, "PUT", addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onCellEditingStarted: function (event) {

            },
            onCellEditingStopped: function () {
            },
            onRowSelected: function () {
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'cpsWarehouseParameters',
    },
    buildingsParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Участок",
                    field: "area",
                    minWidth: 100,
                    tooltipField: 'area',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Группа",
                    field: "group_1",
                    minWidth: 100,
                    tooltipField: 'group_1',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Подгруппа",
                    field: "group_2",
                    minWidth: 100,
                    tooltipField: 'group_2',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Здание",
                    field: "shed",
                    minWidth: 100,
                    tooltipField: 'shed',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Очередь",
                    field: "queue",
                    minWidth: 100,
                    tooltipField: 'queue',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Филиал",
                    field: "affiliate",
                    minWidth: 100,
                    tooltipField: 'affiliate',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Монтаж",
                    field: "fitt",
                    minWidth: 100,
                    tooltipField: 'fitt',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "МонтажГод",
                    field: "fitt_year",
                    minWidth: 100,
                    tooltipField: 'fitt_year',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: NumericCellEditor,
                },
                {
                    headerName: "Проект",
                    field: "proj",
                    minWidth: 100,
                    tooltipField: 'proj',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "ПроектГод",
                    field: "proj_year",
                    minWidth: 100,
                    tooltipField: 'proj_year',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: NumericCellEditor,
                },
                {
                    headerName: "Назв.ППК",
                    field: "equip_master_type",
                    minWidth: 100,
                    tooltipField: 'equip_master_type',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "АУПС",
                    field: "type_aups",
                    minWidth: 100,
                    tooltipField: 'type_aups',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "СОУЭтип",
                    field: "aud_warn_type",
                    minWidth: 100,
                    tooltipField: 'aud_warn_type',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "КатТехСложАСУ",
                    field: "categ_asu",
                    minWidth: 100,
                    tooltipField: 'categ_asu',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "НаКонсерв",
                    field: "on_conserv",
                    minWidth: 50,
                    tooltipField: 'on_conserv',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: true,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.postPutDeleteBuildings, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                agGridParameters.actionMenu.showDelButton();
                agGridParameters.actionMenu.showPassportButton();
                agGridParameters.actionMenu.showTepExportButton();
                agGridParameters.actionMenu.showCopyPathToProjectButton();
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            },
        },
        agName: 'cps_buildings',
    },
    uneditableBuildingsParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Участок",
                    field: "area",
                    minWidth: 50,
                    tooltipField: 'area',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Группа",
                    field: "group_1",
                    minWidth: 50,
                    tooltipField: 'group_1',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Подгруппа",
                    field: "group_2",
                    minWidth: 50,
                    tooltipField: 'group_2',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Здание",
                    field: "shed",
                    minWidth: 300,
                    tooltipField: 'shed',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Очередь",
                    field: "queue",
                    minWidth: 100,
                    tooltipField: 'queue',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Филиал",
                    field: "affiliate",
                    minWidth: 100,
                    tooltipField: 'affiliate',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },

            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: false,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.postPutDeleteBuildings, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                if (userRole === "super-user") {
                    agGridParameters.actionMenu.showCopyEquipOfBuildingButton();
                }
                agGridParameters.actionMenu.showGoToEquipButton();
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'uneditableBuildings',
    },
    uneditableCopyEquipToBuildingParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Участок",
                    field: "area",
                    width: 100,
                    tooltipField: 'area',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Группа",
                    field: "group_1",
                    width: 100,
                    tooltipField: 'group_1',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Подгруппа",
                    field: "group_2",
                    width: 50,
                    tooltipField: 'group_2',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Здание",
                    field: "shed",
                    minWidth: 300,
                    tooltipField: 'shed',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Очередь",
                    field: "queue",
                    width: 100,
                    tooltipField: 'queue',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Филиал",
                    field: "affiliate",
                    minWidth: 100,
                    tooltipField: 'affiliate',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },

            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: false,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            // onFirstDataRendered: (params) => {
            //     params.api.sizeColumnsToFit();
            // }
        },
        agName: 'uneditableCopyEquipToBuildingParameters',
    },
    buildingsPlanGrafParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Здание",
                    children: [
                        {
                            headerName: "Участок",
                            field: "area",
                            minWidth: 100,
                            tooltipField: 'area',
                            filter: "agSetColumnFilter",
                            filterParams: {
                                applyMiniFilterWhileTyping: true,
                            },
                            editable: false,
                        },
                        {
                            headerName: "Группа",
                            field: "group_1",
                            minWidth: 100,
                            tooltipField: 'group_1',
                            filter: "agSetColumnFilter",
                            filterParams: {
                                applyMiniFilterWhileTyping: true,
                            },
                            editable: false,

                        },
                        {
                            headerName: "Подгруппа",
                            field: "group_2",
                            minWidth: 100,
                            tooltipField: 'group_2',
                            filter: "agSetColumnFilter",
                            filterParams: {
                                applyMiniFilterWhileTyping: true,
                            },
                            editable: false,

                        },
                        {
                            headerName: "Здание",
                            field: "shed",
                            minWidth: 100,
                            tooltipField: 'shed',
                            filter: "agSetColumnFilter",
                            filterParams: {
                                applyMiniFilterWhileTyping: true,
                            },
                            editable: false,

                        },
                        {
                            headerName: "Очередь",
                            field: "queue",
                            minWidth: 100,
                            tooltipField: 'queue',
                            filter: "agSetColumnFilter",
                            filterParams: {
                                applyMiniFilterWhileTyping: true,
                            },
                            editable: false,

                        },
                        {
                            headerName: "Филиал",
                            field: "affiliate",
                            minWidth: 100,
                            tooltipField: 'affiliate',
                            filter: "agSetColumnFilter",
                            filterParams: {
                                applyMiniFilterWhileTyping: true,
                            },
                            editable: false,

                        },
                    ]

                },
                {
                    headerName: 'ПланГрафик',
                    children: [
                        {
                            headerName: "ПланГрНазвание",
                            field: "plan_graf_name",
                            minWidth: 100,
                            tooltipField: 'plan_graf_name',
                            filter: "agSetColumnFilter",
                            filterParams: {
                                applyMiniFilterWhileTyping: true,
                            },
                            editable: true,
                            cellEditor: 'agSelectCellEditor',
                            singleClickEdit: true,
                            cellEditorParams: {
                                values: []
                            }
                        },
                        {
                            headerName: "ДатыТО",
                            field: "to_date",
                            minWidth: 100,
                            tooltipField: 'to_date',
                            filter: "agSetColumnFilter",
                            filterParams: {
                                applyMiniFilterWhileTyping: true,
                            },
                            editable: true,
                            cellStyle: {'font-weight': 'bold'}
                        },
                        {
                            headerName: "ПорядНомер",
                            field: "gr_numb",
                            minWidth: 50,
                            tooltipField: 'gr_numb',
                            filter: "agSetColumnFilter",
                            filterParams: {
                                applyMiniFilterWhileTyping: true,
                            },
                            editable: false,

                        },
                    ]
                }
            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: true,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.postPutDeleteBuildings, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                agGridParameters.actionMenu.showInnerMonthButton();
                agGridParameters.actionMenu.showPlanGrafSequenceButton();
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'buildingsPlanGraf',
    },
    buildingsPlanGrafSequnceParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Участок",
                    field: "area",
                    minWidth: 100,
                    tooltipField: 'area',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                    rowDrag: true
                },
                {
                    headerName: "Группа",
                    field: "group_1",
                    minWidth: 100,
                    tooltipField: 'group_1',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "Подгруппа",
                    field: "group_2",
                    minWidth: 100,
                    tooltipField: 'group_2',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "Здание",
                    field: "shed",
                    minWidth: 200,
                    tooltipField: 'shed',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "Очередь",
                    field: "queue",
                    minWidth: 100,
                    tooltipField: 'queue',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "ПланГрНазвание",
                    field: "plan_graf_name",
                    minWidth: 100,
                    tooltipField: 'plan_graf_name',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "ДатыТО",
                    field: "to_date",
                    minWidth: 100,
                    tooltipField: 'to_date',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "ПорядНомер",
                    field: "gr_numb",
                    minWidth: 50,
                    tooltipField: 'gr_numb',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,

                },

            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: false,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
            },
            onRowSelected: function () {
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            },
            rowDragManaged: true,
            animateRows: true,
        },
        agName: 'buildingsPlanGrafSequnce',
    },
    uneditableBuildingsPlanGrafikParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Участок",
                    field: "area",
                    minWidth: 100,
                    tooltipField: 'area',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "ПланГрафик",
                    field: "plan_graf_name",
                    minWidth: 100,
                    tooltipField: 'plan_graf_name',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },

            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: false,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: null,
            onRowSelected: function () {
                agGridParameters.actionMenu.showPlanGrafButton();
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'uneditableBuildingsPlanGrafik',
    },
    uneditableEquipmentItemBuildingsUsageParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Участок",
                    field: "area",
                    minWidth: 100,
                    tooltipField: 'area',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Группа",
                    field: "group_1",
                    minWidth: 100,
                    tooltipField: 'group_1',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Подгруппа",
                    field: "group_2",
                    minWidth: 100,
                    tooltipField: 'group_2',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Здание",
                    field: "shed",
                    minWidth: 200,
                    tooltipField: 'shed',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Очередь",
                    field: "queue",
                    minWidth: 100,
                    tooltipField: 'queue',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Филиал",
                    field: "affiliate",
                    minWidth: 100,
                    tooltipField: 'affiliate',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Количество",
                    field: "quantity",
                    minWidth: 100,
                    tooltipField: 'quantity',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Измерение",
                    field: "measure",
                    minWidth: 100,
                    tooltipField: 'measure',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                },
            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: false,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: null,
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'uneditableBuildingsPlanGrafik',
    },
    equipmentParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Название",
                    field: "equip_name",
                    minWidth: 100,
                    tooltipField: 'equip_name',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "ТипОбобщенный",
                    field: "kind_app",
                    minWidth: 100,
                    tooltipField: 'kind_app',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Тип",
                    field: "kind_app_second",
                    minWidth: 100,
                    tooltipField: 'kind_app_second',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Сигнал",
                    field: "kind_signal",
                    minWidth: 100,
                    tooltipField: 'kind_signal',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Производитель",
                    field: "brand_name",
                    minWidth: 100,
                    tooltipField: 'brand_name',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "ТОостанов",
                    field: "to_ostanov",
                    minWidth: 100,
                    tooltipField: 'to_ostanov',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
                {
                    headerName: "ТОостановИТР",
                    field: "to_ostanov_itr",
                    minWidth: 50,
                    tooltipField: 'to_ostanov_itr',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },

            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: true,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.postPutDeleteEquipment, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                agGridParameters.actionMenu.showDelButton();
                agGridParameters.actionMenu.showEquipUsageButton();
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'cps_equipment',
    },
    uneditableEquipmentParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Название",
                    field: "equip_name",
                    minWidth: 100,
                    tooltipField: 'equip_name',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "ТипОбобщенный",
                    field: "kind_app",
                    minWidth: 100,
                    tooltipField: 'kind_app',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Тип",
                    field: "kind_app_second",
                    minWidth: 100,
                    tooltipField: 'kind_app_second',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Сигнал",
                    field: "kind_signal",
                    minWidth: 100,
                    tooltipField: 'kind_signal',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Производитель",
                    field: "brand_name",
                    minWidth: 100,
                    tooltipField: 'brand_name',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },

            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: false,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
            },
            onRowSelected: function () {
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'uneditableEquipmentParameters',
    },
    uneditableEquipmentParameters2: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Название",
                    field: "equip_name",
                    minWidth: 100,
                    tooltipField: 'equip_name',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "ТипОбобщенный",
                    field: "kind_app",
                    minWidth: 100,
                    tooltipField: 'kind_app',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Тип",
                    field: "kind_app_second",
                    minWidth: 100,
                    tooltipField: 'kind_app_second',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Сигнал",
                    field: "kind_signal",
                    minWidth: 100,
                    tooltipField: 'kind_signal',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "Производитель",
                    field: "brand_name",
                    minWidth: 100,
                    tooltipField: 'brand_name',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },

            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: false,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
            },
            onRowSelected: function () {
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'uneditableEquipmentParameters2',
    },
    equipmentInBuildingsParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Название",
                    field: "equip_name",
                    minWidth: 350,
                    tooltipField: 'equip_name',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                    rowDrag: true,
                },
                {
                    headerName: "Тип",
                    field: "kind_app",
                    minWidth: 100,
                    tooltipField: 'kind_app',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "Количество",
                    field: "quantity",
                    minWidth: 100,
                    tooltipField: 'quantity',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: NumericCellEditor,
                    cellStyle: {'font-weight': 'bold'}
                },
                {
                    headerName: "Измерение",
                    field: "measure",
                    minWidth: 100,
                    tooltipField: 'measure',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    },
                    cellStyle: {'font-weight': 'bold'}
                },
                {
                    headerName: "Год",
                    field: "equip_year",
                    minWidth: 100,
                    tooltipField: 'equip_year',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: NumericCellEditor,
                    cellStyle: {'font-weight': 'bold'}
                },
                {
                    headerName: "Коментарии",
                    field: "equip_comments",
                    minWidth: 100,
                    tooltipField: 'equip_comments',
                    sortable: false,
                    filter: false,
                    cellEditor: 'agLargeTextCellEditor',

                },


            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: true,
                menuTabs: ['filterMenuTab'],
            },
            onCellEditingStarted: (event) => {

            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.getPutDeleteEquipmentInBuilding, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                // if (userRole === "super-user" || userRole === "Nur_master" || userRole === "Yamburg_master" ||
                //     userRole === "Zapolyarka_master") {
                agGridParameters.actionMenu.showDelButton();
                agGridParameters.actionMenu.showEditButton();
                // }
                agGridParameters.actionMenu.showReturnToBuildingsButton();

            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            },
            rowDragManaged: true,
            animateRows: true,
        },
        agName: 'equipmentInBuildings',
    },
    tehnObslMonthInBuildingsParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Название",
                    field: "equip_name",
                    minWidth: 200,
                    tooltipField: 'equip_name',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "Количество",
                    field: "quantity",
                    minWidth: 100,
                    tooltipField: 'quantity',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "Измерение",
                    field: "measure",
                    minWidth: 100,
                    tooltipField: 'measure',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "Январь текст",
                    field: "cel_january",
                    minWidth: 100,
                    tooltipField: 'cel_january',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "ЯнварьПров",
                    field: "cel_january_gray",
                    minWidth: 50,
                    tooltipField: 'cel_january_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
                {
                    headerName: "Февраль текст",
                    field: "cel_february",
                    minWidth: 100,
                    tooltipField: 'cel_february',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "ФевральПров",
                    field: "cel_february_gray",
                    minWidth: 50,
                    tooltipField: 'cel_february_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
                {
                    headerName: "Март текст",
                    field: "cel_march",
                    minWidth: 100,
                    tooltipField: 'cel_march',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "ЯнварьПров",
                    field: "cel_march_gray",
                    minWidth: 50,
                    tooltipField: 'cel_march_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
                {
                    headerName: "Апрель текст",
                    field: "cel_april",
                    minWidth: 100,
                    tooltipField: 'cel_april',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "АпрельПров",
                    field: "cel_april_gray",
                    minWidth: 50,
                    tooltipField: 'cel_april_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
                {
                    headerName: "Май текст",
                    field: "cel_may",
                    minWidth: 100,
                    tooltipField: 'cel_may',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "МайПров",
                    field: "cel_may_gray",
                    minWidth: 50,
                    tooltipField: 'cel_may_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
                {
                    headerName: "Июнь текст",
                    field: "cel_june",
                    minWidth: 100,
                    tooltipField: 'cel_june',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "ИюньПров",
                    field: "cel_june_gray",
                    minWidth: 50,
                    tooltipField: 'cel_june_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
                {
                    headerName: "Июль текст",
                    field: "cel_july",
                    minWidth: 100,
                    tooltipField: 'cel_july',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "ИюльПров",
                    field: "cel_july_gray",
                    minWidth: 50,
                    tooltipField: 'cel_july_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
                {
                    headerName: "Август текст",
                    field: "cel_august",
                    minWidth: 100,
                    tooltipField: 'cel_august',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "АвгустПров",
                    field: "cel_august_gray",
                    minWidth: 50,
                    tooltipField: 'cel_august_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
                {
                    headerName: "Сентябрь текст",
                    field: "cel_september",
                    minWidth: 100,
                    tooltipField: 'cel_september',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "СентябрьПров",
                    field: "cel_september_gray",
                    minWidth: 50,
                    tooltipField: 'cel_september_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
                {
                    headerName: "Октябрь текст",
                    field: "cel_october",
                    minWidth: 100,
                    tooltipField: 'cel_october',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "ОктябрьПров",
                    field: "cel_october_gray",
                    minWidth: 50,
                    tooltipField: 'cel_october_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },
                {
                    headerName: "Ноябрь текст",
                    field: "cel_november",
                    minWidth: 100,
                    tooltipField: 'cel_november',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "НоябрьПров",
                    field: "cel_november_gray",
                    minWidth: 50,
                    tooltipField: 'cel_november_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },

                {
                    headerName: "Декабрь текст",
                    field: "cel_december",
                    minWidth: 100,
                    tooltipField: 'cel_december',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                },
                {
                    headerName: "ДекабрьПров",
                    field: "cel_december_gray",
                    minWidth: 50,
                    tooltipField: 'cel_december_gray',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: true,
                    cellRenderer: CheckboxRenderer,
                },


            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: true,
                menuTabs: ['filterMenuTab'],
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.getPutDeleteEquipmentInBuilding, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'TehnObslMonthInBuilding',
    },
    equipmentForChooseParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Название",
                    field: "equip_name",
                    minWidth: 400,
                    tooltipField: 'area',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Тип",
                    field: "kind_app",
                    minWidth: 60,
                    tooltipField: 'group_2',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "ТипОбобщенный",
                    field: "kind_app_second",
                    minWidth: 60,
                    tooltipField: 'shed',
                    sortable: true,
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Сигнал",
                    field: "kind_signal",
                    maxWidth: 120,
                    tooltipField: 'group_1',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },
                {
                    headerName: "Производитель",
                    field: "brand_name",
                    maxWidth: 120,
                    tooltipField: 'brand_name',
                    sortable: true, filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                },

            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: false,
                menuTabs: ['filterMenuTab'],
            },
            suppressContextMenu: true,
            enableBrowserTooltips: true,
            onRowSelected: function () {
            },
        },
        agName: 'cps_equipment_for_choose',
    },
    equipmentInBuildingsParametersPlanGrForWorkers: {
        gridOptions: {
            columnDefs: [

                {
                    headerName: "ПланГрНазвание",
                    field: "plan_graf_name",
                    minWidth: 200,
                    tooltipField: 'plan_graf_name',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    }
                },
                {
                    headerName: "ПорядНомер",
                    field: "gr_numb",
                    minWidth: 50,
                    tooltipField: 'gr_numb',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,

                },
                {
                    headerName: "ДатыТО",
                    field: "to_date",
                    minWidth: 100,
                    tooltipField: 'to_date',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },


                {
                    headerName: "Группа",
                    field: "group_1",
                    minWidth: 100,
                    tooltipField: 'group_1',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,

                },
                {
                    headerName: "Подгруппа",
                    field: "group_2",
                    minWidth: 100,
                    tooltipField: 'group_2',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,

                },
                {
                    headerName: "Здание",
                    field: "shed",
                    minWidth: 100,
                    tooltipField: 'shed',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,

                },

                {
                    headerName: "Название",
                    field: "equip_name",
                    minWidth: 350,
                    tooltipField: 'equip_name',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "Тип",
                    field: "kind_app",
                    minWidth: 100,
                    tooltipField: 'kind_app',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    editable: false,
                },
                {
                    headerName: "Количество",
                    field: "quantity",
                    minWidth: 100,
                    tooltipField: 'quantity',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: NumericCellEditor,
                    cellStyle: {'font-weight': 'bold'}
                },
                {
                    headerName: "Измерение",
                    field: "measure",
                    minWidth: 100,
                    tooltipField: 'measure',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: 'agSelectCellEditor',
                    singleClickEdit: true,
                    cellEditorParams: {
                        values: []
                    },
                    cellStyle: {'font-weight': 'bold'}
                },
                {
                    headerName: "Год",
                    field: "equip_year",
                    minWidth: 100,
                    tooltipField: 'equip_year',
                    filter: "agSetColumnFilter",
                    filterParams: {
                        applyMiniFilterWhileTyping: true,
                    },
                    cellEditor: NumericCellEditor,
                    cellStyle: {'font-weight': 'bold'}
                },
                {
                    headerName: "Коментарии",
                    field: "equip_comments",
                    minWidth: 100,
                    tooltipField: 'equip_comments',
                    filter: false,
                    cellEditor: 'agLargeTextCellEditor',
                    editable: true,

                },


            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                // editable: true,
                menuTabs: ['filterMenuTab'],
                sortable: false,
            },
            onCellEditingStarted: (event) => {

            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.getPutDeleteEquipmentInBuilding, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                agGridParameters.actionMenu.showDelButton();
                agGridParameters.actionMenu.showEditButton();

            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            },
            rowDragManaged: true,
            animateRows: true,
        },
        agName: 'equipmentInBuildingsParametersPlanGrForWorkers',
    },
}

export function initializeAgGridParameters() {

    agGridParameters.cpsWarehouseParameters.gridOptions.columnDefs.forEach((columnDefs) => {
        if (columnDefs.field === 'sex') {
            columnDefs.cellEditorParams.values = lists.workers.sex;
        }
        if (columnDefs.field === 'height') {
            columnDefs.cellEditorParams.values = lists.workers.height;
        }
        if (columnDefs.field === 'template_card') {
            columnDefs.cellEditorParams.values = lists.workers.template_card;
        }
    });
    agGridParameters.equipmentParameters.gridOptions.columnDefs.forEach((columnDefs) => {
        if (columnDefs.field === 'kind_app') {
            columnDefs.cellEditorParams.values = lists.equipment.kind_app;
        }
        if (columnDefs.field === 'kind_app_second') {
            lists.equipment.kind_app_second.forEach((elem) => {
                columnDefs.cellEditorParams.values.push(elem.kind_app_second);
            })
        }
        if (columnDefs.field === 'kind_signal') {
            lists.equipment.kind_signal.forEach((elem) => {
                columnDefs.cellEditorParams.values.push(elem);
            })
        }
    });
    agGridParameters.buildingsParameters.gridOptions.columnDefs.forEach((columnDefs) => {
        if (columnDefs.field === 'area') {
            columnDefs.cellEditorParams.values = lists.buildings.area;
        }
        if (columnDefs.field === 'group_1') {
            lists.buildings.group_1.forEach((elem) => {
                columnDefs.cellEditorParams.values.push(elem.group_1);
            })
        }
        if (columnDefs.field === 'type_aups') {
            lists.buildings.type_aups.forEach((elem) => {
                columnDefs.cellEditorParams.values.push(elem);
            })
        }
        if (columnDefs.field === 'aud_warn_type') {
            lists.buildings.aud_warn_type.forEach((elem) => {
                columnDefs.cellEditorParams.values.push(elem);
            })
        }
        if (columnDefs.field === 'categ_asu') {
            lists.buildings.categ_asu.forEach((elem) => {
                columnDefs.cellEditorParams.values.push(elem);
            })
        }
        if (columnDefs.field === 'group_2') {
            columnDefs.cellEditorParams.values.push('');
            lists.buildings.group_2.forEach((elem) => {
                if (columnDefs.cellEditorParams.values.indexOf(elem.group_2) === -1) {
                    columnDefs.cellEditorParams.values.push(elem.group_2);
                }
            })
        }
        if (columnDefs.field === 'queue') {
            columnDefs.cellEditorParams.values = lists.buildings.queue;
        }
        if (columnDefs.field === 'affiliate') {
            columnDefs.cellEditorParams.values = lists.buildings.affiliate;
        }
    });
    agGridParameters.equipmentInBuildingsParameters.gridOptions.columnDefs.forEach((columnDefs) => {
        if (columnDefs.field === 'measure') {
            columnDefs.cellEditorParams.values = lists.equipment.measure;
        }

        if ((columnDefs.field === 'edited_by_worker' || columnDefs.field === 'created_by_worker') &&
            (userRole === "super-user" || userRole === "Nur_master" ||
                userRole === "Yamburg_master" || userRole === "Zapolyarka_master")) {
            columnDefs.hide = false;
            columnDefs.editable = false;
        }
        if ((columnDefs.field === 'deleted_by_worker') &&
            (userRole === "super-user" || userRole === "Nur_master" ||
                userRole === "Yamburg_master" || userRole === "Zapolyarka_master")) {
            columnDefs.editable = false;
        }
    });

    agGridParameters.buildingsPlanGrafParameters.gridOptions.columnDefs[1].children.forEach((columnDefs) => {
        if (columnDefs.field === 'plan_graf_name') {
            if (userRole === "super-user" || userRole === "Nur_master" ||
                userRole === "Yamburg_master" || userRole === "Zapolyarka_master") {
                columnDefs.cellEditorParams.values = lists.buildings.planGraf;
            } else {
                delete columnDefs.cellEditorParams;
                delete columnDefs.cellEditor;
            }
        }
    });


}
