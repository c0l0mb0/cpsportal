import DatePicker from "./ag_grid_classes/date-picker";
import {config, httpRequest} from "./cps-portal-dao";
import {addCSRF} from "./helper";
import NumericCellEditor from "./ag_grid_classes/numericCellEditor.js";

export let agGridParameters = {
    agOuterId: undefined,
    actionMenu: undefined,
    workersParameters: {
        gridOptions: {
            columnDefs: [
                {headerName: "ФИО", field: "fio", minWidth: 100, tooltipField: 'fio', sortable: true},
                {
                    headerName: "N табеля",
                    field: "tab_nom",
                    minWidth: 100,
                    tooltipField: 'tab_nom',
                    cellEditor: NumericCellEditor,
                },
                {headerName: "Должность", field: "worker_position", minWidth: 100, tooltipField: 'worker_position'},
            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: true,
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.postPutDeleteWorkers, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                agGridParameters.actionMenu.showDelButton();
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'workers',
    },
    fireInstrParameters: {
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
                    headerName: "ПоследняяПроверка",
                    field: "fire_instr_last",
                    minWidth: 60,
                    tooltipField: 'fire_instr_last',
                    cellEditor: DatePicker,
                    valueFormatter: (params) => {
                        if (params.data.fire_instr_last !== undefined && params.data.fire_instr_last !== null) {
                            let dateAsString = params.data.fire_instr_last;
                            let dateParts = dateAsString.split('-');
                            return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
                        }
                    },
                },
                {
                    headerName: "СледующаяПроверка",
                    field: "fire_instr_next",
                    minWidth: 60,
                    tooltipField: 'fire_instr_next',
                    cellEditor: DatePicker,
                    valueFormatter: (params) => {
                        if (params.data.fire_instr_next !== undefined && params.data.fire_instr_next !== null) {
                            let dateAsString = params.data.fire_instr_next;
                            let dateParts = dateAsString.split('-');
                            return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
                        }

                    },
                },
            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: true,
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.postPutDeleteWorkers, "PUT", addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                agGridParameters.actionMenu.showPlusSixButton();
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'fireInstr',
    },
    buildingsParameters: {
        gridOptions: {
            columnDefs: [
                {headerName: "Участок", field: "area", minWidth: 100, tooltipField: 'area', sortable: true,filter: true, },
                {headerName: "Группа", field: "group_1", minWidth: 100, tooltipField: 'group_1', sortable: true,filter: true,},
                {headerName: "Подгруппа", field: "group_2", minWidth: 100, tooltipField: 'group_2', sortable: true,filter: true,},
                {headerName: "Здание", field: "shed", minWidth: 100, tooltipField: 'shed', sortable: true,filter: true,},
                {headerName: "Очередь", field: "Queue", minWidth: 100, tooltipField: 'Queue', sortable: true,filter: true,},
                {headerName: "Филиал", field: "affiliate", minWidth: 100, tooltipField: 'affiliate', sortable: true,filter: true,},
                {headerName: "Монтаж", field: "fitt", minWidth: 100, tooltipField: 'fitt', sortable: true,filter: true,},
                {headerName: "МонтажГод", field: "fitt_year", minWidth: 100, tooltipField: 'fitt_year', sortable: true,filter: true,},
                {headerName: "Проект", field: "proj", minWidth: 100, tooltipField: 'proj', sortable: true,filter: true,},
                {headerName: "ПроектГод", field: "proj_year", minWidth: 100, tooltipField: 'proj_year', sortable: true,filter: true,},
                {headerName: "АУПС", field: "type_aups", minWidth: 100, tooltipField: 'type_aups', sortable: true,filter: true,},
                {headerName: "СОУЭтип", field: "aud_warn_type", minWidth: 100, tooltipField: 'aud_warn_type', sortable: true,filter: true,},
                {headerName: "КатТехСложАСУ", field: "aud_warn_type", minWidth: 100, tooltipField: 'aud_warn_type', sortable: true,filter: true,},
            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: true,
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.postPutDeleteBuildings, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                agGridParameters.actionMenu.showDelButton();
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'cps_buildings',
    },
    uneditableBuildingsParameters: {
        gridOptions: {
            columnDefs: [
                {headerName: "Участок", field: "area", minWidth: 100, tooltipField: 'area', sortable: true},
                {headerName: "Группа", field: "group_1", minWidth: 100, tooltipField: 'group_1', sortable: true},
                {headerName: "Подгруппа", field: "group_2", minWidth: 100, tooltipField: 'group_2', sortable: true},
                {headerName: "Здание", field: "shed", minWidth: 100, tooltipField: 'shed', sortable: true},
                {headerName: "Очередь", field: "Queue", minWidth: 100, tooltipField: 'Queue', sortable: true},
                {headerName: "Филиал", field: "affiliate", minWidth: 100, tooltipField: 'affiliate', sortable: true},

            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: false,
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.postPutDeleteBuildings, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                agGridParameters.actionMenu.showGoToEquipButton();
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'cps_uneditable_buildings',
    },
    equipmentParameters: {
        gridOptions: {
            columnDefs: [
                {headerName: "Название", field: "equip_name", minWidth: 100, tooltipField: 'equip_name', sortable: true, filter: true,},
                {
                    headerName: "ТипОбобщенный",
                    field: "kind_app",
                    minWidth: 100,
                    tooltipField: 'kind_app',
                    sortable: true, filter: true,
                },
                {headerName: "Тип", field: "kind_app_second", minWidth: 100, tooltipField: 'kind_app_second', sortable: true, filter: true,},
                {
                    headerName: "Сигнал",
                    field: "kind_signal",
                    minWidth: 100,
                    tooltipField: 'kind_signal',
                    sortable: true, filter: true,
                },
                {
                    headerName: "Производитель",
                    field: "brand_name",
                    minWidth: 100,
                    tooltipField: 'brand_name',
                    sortable: true, filter: true,
                },

            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: true,
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.postPutDeleteEquipment, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                agGridParameters.actionMenu.showDelButton();
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'cps_equipment',
    },
    equipmentInBuildingsParameters: {
        gridOptions: {
            columnDefs: [
                {
                    headerName: "Название",
                    field: "equip_name",
                    minWidth: 100,
                    tooltipField: 'equip_name',
                    sortable: true, filter: true,
                    editable: false,
                },
                {headerName: "Количество", field: "quantity", minWidth: 100, tooltipField: 'quantity', sortable: true, filter: true,},
                {headerName: "Измерение", field: "measure", minWidth: 100, tooltipField: 'measure', sortable: true, filter: true,},
                {headerName: "Год", field: "app_year", minWidth: 100, tooltipField: 'app_year', sortable: true, filter: true,},

            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: true,
            },
            enableBrowserTooltips: true,
            onCellValueChanged: function (event) {
                httpRequest(config.api.getPutDeleteEquipmentInBuilding, "PUT",
                    addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
                agGridParameters.actionMenu.showDelButton();
                agGridParameters.actionMenu.showReturnToBuildingsButton();
                agGridParameters.actionMenu.showEditButton();
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'equipmentInBuildings',
    },
    equipmentForChooseParameters: {
        gridOptions: {
            columnDefs: [
                {headerName: "Название", field: "equip_name", minWidth: 350, tooltipField: 'area', sortable: true, filter: true,},
                {
                    headerName: "Тип",
                    field: "kind_app",
                    minWidth: 60,
                    tooltipField: 'group_2',
                    sortable: true, filter: true,
                },
                {headerName: "ТипОбобщенный", field: "kind_app_second", minWidth: 60, tooltipField: 'shed', sortable: true, filter: true,},
                {
                    headerName: "Сигнал",
                    field: "kind_signal",
                    maxWidth: 120,
                    tooltipField: 'group_1',
                    sortable: true, filter: true,
                },
            ],
            rowSelection: 'single',
            defaultColDef: {
                resizable: true,
                editable: false,
            },
            enableBrowserTooltips: true,
            onRowSelected: function () {
                // agGridParameters.actionMenu.showDelButton();
            },
            // onFirstDataRendered: (params) => {
            //     params.api.sizeColumnsToFit();
            // }
        },
        agName: 'cps_equipment_for_choose',
    },
}
