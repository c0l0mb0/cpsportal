import {config, httpRequest} from "../cps-portal-dao";
import {addCSRF} from "../helper";
import {lists} from "../lists";


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
                httpRequest(config.api.postPutDeleteWorkers, "PUT", addCSRF(event.data), event.data.id).catch((rejected) => console.log(rejected));
            },
            onRowSelected: function () {
            },
            onFirstDataRendered: (params) => {
                params.api.sizeColumnsToFit();
            }
        },
        agName: 'warehouseRemainsParameters',
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


}
