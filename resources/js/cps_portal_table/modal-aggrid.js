import {httpRequest} from "./cps-portal-dao";
import {lists} from "./lists";

export default class ModalAggrid {
    gridOptions;
    getDataUrl;
    agName;
    textBoxFilter;
    targetId = 'modal-aggrid';

    constructor(gridOptions, getDataUrl, agName) {
        this.gridOptions = gridOptions;
        this.getDataUrl = getDataUrl;
        this.agName = agName;
        this.renderAgGrid();
    }

    renderAgGrid() {
        this.prepareHtml();
        new agGrid.Grid(document.getElementById(this.targetId), this.gridOptions);
        this.setGridData();
    }

    prepareHtml() {
        let pageContentHtml = document.getElementById(this.targetId);
        pageContentHtml.innerHTML = "";
        pageContentHtml.style.width = '100%'
        pageContentHtml.classList.add('ag-theme-alpine');
    }

    getSelectedRow() {
        let selectedRows = this.gridOptions.api.getSelectedRows()
        if (selectedRows.length > 0) {
            return selectedRows[0];
        }
    }
    restoreFilterModel(savedFilterModel) {
        this.gridOptions.api.setFilterModel(savedFilterModel);
    }


    setGridData() {
        this.gridOptions.api.setRowData(lists.equipment.all);
        // if (this.gridOptions.agName === 'cps_equipment_for_choose') {
        //
        // } else {
        //     console.log('else ffffff')
        //     httpRequest(this.getDataUrl, 'GET').then((data) => {
        //         if (data === null) {
        //             throw 'setGridData data is null';
        //         }
        //         this.gridOptions.api.setRowData(data);
        //     });
        // }

    }

    setFilterTextBox() {
        this.textBoxFilter.addEventListener('input', () => {
            this.gridOptions.api.setQuickFilter(
                this.textBoxFilter.value
            );
        });
    }

    resetFilter() {
        this.gridOptions.api.setQuickFilter("");
    }

}

