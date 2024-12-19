import TableAgGrid from './page_content/aggrid.js'
import {config, httpRequest} from './cps-portal-dao.js'
import {addCSRF, changePageTitle} from './helper.js'
import {agGridParameters} from './page_content/ag-grid-parameters.js'


export default class SideBar {
    tableAgGrid;
    actionMenu;
    modalForm;
    cashedAgGridBuildings = undefined;
    cashedAgGridEquipment = undefined;
    pageContent;

    setButtonsActions() {
        document.getElementById('sidebarCollapse').onclick = () => {
            document.getElementById('sidebar').classList.toggle("active");
        };

        document.querySelector('.sidebar__warehouse-reminders').onclick = () => {
            this.clearPageContent();
            this.tableAgGrid = new TableAgGrid(agGridParameters.warehouseRemainsParameters.gridOptions,
                config.api.getWarehouseRemainsALl, null,
                agGridParameters.warehouseRemainsParameters.agName, this.actionMenu);
            this.linksTableAgGridWithActionMenuAndModalForm();
            this.actionMenu.setImportRemindsAction();
            this.actionMenu.showImportRemindsButton();
            changePageTitle("Текущие остатки по спецодежде (данные из бухгалтерии)");
        };

        document.querySelector('.sidebar__warehouse-workers').onclick = () => {
            this.clearPageContent();
            this.tableAgGrid = new TableAgGrid(agGridParameters.cpsWarehouseParameters.gridOptions,
                config.api.getWorkersALl, null,
                agGridParameters.cpsWarehouseParameters.agName, this.actionMenu);
            this.linksTableAgGridWithActionMenuAndModalForm();
            changePageTitle("СИЗ работников");
        };

    }

    clearPageContent() {
        while (this.pageContent.firstChild) {
            this.pageContent.removeChild(this.pageContent.firstChild);
        }
        this.pageContent.className = '';
    }

    linksTableAgGridWithActionMenuAndModalForm() {
        this.actionMenu.tableAgGrid = this.tableAgGrid;
        this.modalForm.tableAgGrid = this.tableAgGrid;
    }

}





