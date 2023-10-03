import {httpRequest} from './cps-portal-dao.js'
import {myExcelXML} from './ag_grid_classes/excel-export.js';
import {addCSRF} from './helper.js';
import {AG_GRID_LOCALE_RU} from "./ag_grid_classes/local.ru";

//ag grid wrapper, first field from DAO has to have the name "id". constructor(gridOptions, getDataUrl, delUrl, agName, actionMenu)
export default class TableAgGrid {
    actionMenu;
    gridOptions;
    getDataUrl;
    delUrl;
    isReady = false;
    targetId = 'page-content';
    confirmDeleteBtn = document.querySelector('.modal__confirm-delete-entry-btn');
    agName;

    constructor(gridOptions, getDataUrl, delUrl, agName, actionMenu) {
        this.gridOptions = gridOptions;
        this.getDataUrl = getDataUrl;
        this.delUrl = delUrl;
        this.agName = agName;
        this.actionMenu = actionMenu;
        this.renderAgGrid();
    }

    renderAgGrid() {
        this.prepareHtml();
        this.gridOptions.localeText = AG_GRID_LOCALE_RU;
        new agGrid.Grid(document.getElementById(this.targetId), this.gridOptions);
        this.setGridData();
        // this.setGridCloseObserver();
        this.setDeleteButtonAction();
        this.isReady = true;
        this.actionMenu.hideALl();
        this.actionMenu.setExportExcelAction();
    }

    setGridData(idToScroll) {
        httpRequest(this.getDataUrl, 'GET').then((data) => {
            if (data === null) {
                throw 'setGridData data is null';
            }
            this.gridOptions.api.setRowData(data);
            if (idToScroll !== undefined) {
                let _this = this;
                this.gridOptions.api.forEachNode(function (node) {
                    if (node.data.id === idToScroll) {
                        node.setSelected(true);
                        _this.gridOptions.api.ensureIndexVisible(node.rowIndex, 'middle');
                    }
                });
            }
        });
    }

    getSelectedRow() {
        let selectedRows = this.gridOptions.api.getSelectedRows()
        if (selectedRows.length > 0) {
            return selectedRows[0];
        }
    }

    setDeleteButtonAction() {
        if (this.delUrl !== null) {
            this.confirmDeleteBtn.onclick = () => {
                let selectedRow = this.getSelectedRow();
                let csrf = {};
                csrf = addCSRF(csrf);
                httpRequest(this.delUrl, 'DELETE', csrf, selectedRow.id).then(() => {
                    this.actionMenu.hideAllOneRowAction();
                    this.setGridData();
                    $('#modal__confirm-delete-entry').modal('hide');
                });
            };
        }

    }

    setGridCloseObserver() {
        let this_ = this;
        const observer = new MutationObserver(function (mutations_list) {
            console.log(mutations_list)
            this_.actionMenu.hideALl();
            observer.disconnect();
            //if another one mutation observer has been started
            // if (mutations_list.length > 1) {
            //     observer.disconnect();
            //     return;
            // }

            // console.log(mutations_list);

            // let this__ =  this_;
            // mutations_list.forEach(node => {
            //     if (node.removedNodes.length > 0) {
            //         // this__.actionMenu.hideALl();
            //         // console.log('setGridCloseObserver');
            //         observer.disconnect();
            //     }
            // })
        });
        observer.observe(document.getElementById(this.targetId), {subtree: false, childList: true});
    }

    prepareHtml() {
        let pageContentHtml = document.getElementById(this.targetId);
        pageContentHtml.innerHTML = "";
        pageContentHtml.style.width = '100%'
        pageContentHtml.classList.add('ag-theme-alpine');
    }

    exportDisplyedDataToExcel() {
        let agHeaders = [];
        let agFields = [];
        this.gridOptions.columnApi.getAllDisplayedColumns().forEach(element => (agHeaders.push(element.colDef.headerName)));
        this.gridOptions.columnApi.getAllDisplayedColumns().forEach(element => (agFields.push(element.colDef.field)));
        let agData = [];
        this.gridOptions.api.forEachNode((rowNode, index) => {
            agData[index] = rowNode.data;
            let agDataTmp = Object.keys(agData[index])
                .filter(key => agFields.includes(key))
                .reduce((obj, key) => {
                    obj[key] = agData[index][key];
                    return obj;
                }, {});
            agData[index] = agDataTmp;
        });

        let excelData = [];
        let tmpArray = [];
        for (const elementAgData of agData) {
            tmpArray = [];
            for (const elementAgFields of agFields) {
                for (const [key, value] of Object.entries(elementAgData)) {

                    if (elementAgFields === key) {
                        tmpArray.push(value)
                    }
                }
            }
            excelData.push(tmpArray);
        }
        //format text "null, false, true values"
        for (let i = 0; i < excelData.length; i++) {
            for (let j = 0; j < excelData[i].length; j++) {
                if (excelData[i][j] === null) {
                    excelData[i][j] = "";
                }
                if (excelData[i][j] === false) {
                    excelData[i][j] = "нет";
                }
                if (excelData[i][j] === true) {
                    excelData[i][j] = "да";
                }
            }
        }

        excelData.unshift(agHeaders);
        let myTestXML = new myExcelXML(excelData, this.agName);
        myTestXML.downLoad();
    }
}
