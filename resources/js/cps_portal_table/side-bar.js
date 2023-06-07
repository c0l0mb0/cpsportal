import TableAgGrid from './aggrid.js'
import {config} from './cps-portal-dao.js'
import {changePageTitle} from './helper.js'
import {agGridParameters} from './ag-grid-parameters.js'
import {queryselector} from "caniuse-lite/data/features";

export default class SideBar {
    tableAgGrid;
    actionMenu;
    modalForm;

    setButtonsActions() {

        document.getElementById('sidebarCollapse').onclick = () => {
            document.getElementById('sidebar').classList.toggle("active");
        };

        document.querySelector('.sidebar__edit-staff').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.workersParameters.gridOptions,
                config.api.getWorkersALl, config.api.postPutDeleteWorkers,
                agGridParameters.workersParameters.agName, this.actionMenu);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.modalForm.setModalWorkersFormHtml();
            this.actionMenu.showPlusAndExcelButton();
            this.modalForm.setFormWithTexboxesSubmitHandler();
            changePageTitle("Работники");
        };

        document.querySelector('.sidebar__edit-fire_instr').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.fireInstrParameters.gridOptions,
                config.api.getWorkersALl, config.api.postPutDeleteWorkers,
                agGridParameters.fireInstrParameters.agName, this.actionMenu);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.showExcelButton();
            this.actionMenu.setFireExamPlusSixAction();
            this.modalForm.setFormWithTexboxesSubmitHandler();
            changePageTitle("Пожинструктаж");
        };

        document.querySelector('.sidebar__edit-equip-in-building').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.uneditableBuildingsParameters.gridOptions,
                config.api.getBuildingsALl, config.api.postPutDeleteBuildings,
                agGridParameters.uneditableBuildingsParameters.agName, this.actionMenu);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.showExcelButton();
            this.actionMenu.setEditInnerAction();
            this.modalForm.setFormWithTexboxesSubmitHandler();
            changePageTitle("Оборудование в здании");
        };

        document.querySelector('.sidebar__edit-buildings').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.buildingsParameters.gridOptions,
                config.api.getBuildingsALl, config.api.postPutDeleteBuildings,
                agGridParameters.buildingsParameters.agName, this.actionMenu);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.unsetEditAndAddEquipToBuildingButtonAction();
            this.modalForm.setModalCpsBuildingsFormHtml();
            this.actionMenu.showPlusAndExcelButton();
            this.modalForm.setFormWithTexboxesSubmitHandler();
            changePageTitle("Здания");
        };

        document.querySelector('.sidebar__edit-equip').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.equipmentParameters.gridOptions,
                config.api.getEquipmentALl, config.api.postPutDeleteEquipment,
                agGridParameters.equipmentParameters.agName, this.actionMenu);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.unsetEditAndAddEquipToBuildingButtonAction();
            this.modalForm.setModalCpsEquipmentFormHtml();
            this.actionMenu.showPlusAndExcelButton();
            this.modalForm.setFormWithTexboxesSubmitHandler();
            changePageTitle("Оборудование");
        };
        document.querySelector('.sidebar__export-reports').onclick = () => {
            const pageContent = document.querySelector('#page-content');
            const reportList = document.createElement('ul');
            pageContent.appendChild(reportList);

            const exportTestLiTag = document.createElement('li');
            exportTestLiTag.classList.add("export_list-item");
            reportList.appendChild(exportTestLiTag);
            const exportTestAtag = document.createElement('a');
            exportTestLiTag.appendChild(exportTestAtag);

            exportTestAtag.innerText = "экспорт тест";
            exportTestAtag.href = config.api.getExelTest;

            changePageTitle("Отчеты");
        };
    }
}





