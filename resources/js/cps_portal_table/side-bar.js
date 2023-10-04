import TableAgGrid from './aggrid.js'
import {config} from './cps-portal-dao.js'
import {changePageTitle} from './helper.js'
import {agGridParameters} from './ag-grid-parameters.js'
import {userRole} from './app.js'


export default class SideBar {
    tableAgGrid;
    actionMenu;
    modalForm;
    reportList;

    setButtonsVision() {
        if (userRole === "super-user") {
            document.querySelector('.sidebar__edit-equip').hidden  = false;
            document.querySelector('.sidebar__edit-buildings').hidden = false;
            document.querySelector('.sidebar__export-reports').hidden = false;
            document.querySelector('.sidebar__export-plan_grafici').hidden = false;
            document.querySelector('.sidebar__edit-plan_grafici').hidden = false;
            document.querySelector('.sidebar__edit-equip-in-building').hidden = false;
        } else {
            document.querySelector('.sidebar__edit-equip-in-building').hidden = false;
        }
    }

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
            this.actionMenu.unsetEditAndAddButtonAction();
            this.actionMenu.showExcelButton();
            this.actionMenu.setEditInnerAction();
            changePageTitle("Оборудование в здании");
        };

        document.querySelector('.sidebar__edit-equip').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.equipmentParameters.gridOptions,
                config.api.getEquipmentALl, config.api.postPutDeleteEquipment,
                agGridParameters.equipmentParameters.agName, this.actionMenu);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.unsetEditAndAddButtonAction();
            this.actionMenu.showPlusAndExcelButton();
            this.actionMenu.setAddButtonActionForNewEquipment()
            changePageTitle("Оборудование");
        };

        document.querySelector('.sidebar__edit-buildings').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.buildingsParameters.gridOptions,
                config.api.getBuildingsALl, config.api.postPutDeleteBuildings,
                agGridParameters.buildingsParameters.agName, this.actionMenu);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.unsetEditAndAddButtonAction();
            this.modalForm.setModalCpsBuildingsFormHtml();
            this.actionMenu.showPlusAndExcelButton();
            this.actionMenu.setExportPassportAction();
            changePageTitle("Здания");
        };

        document.querySelector('.sidebar__export-reports').onclick = () => {
            this.actionMenu.hideALl();
            const pageContent = document.querySelector('#page-content');
            while (pageContent.firstChild) {
                pageContent.removeChild(pageContent.firstChild);
            }
            this.reportList = document.createElement('ul');
            pageContent.appendChild(this.reportList);

            this.addLinkToReports("Нормы запаса КИПиСА", config.api.getExportNormiZapasaKip);
            this.addLinkToReports("Потребность МТР", config.api.getExportPotrebnostMtr);
            // this.addLinkToReports("Паспорт",config.api.getExportPassport);
            // this.addLinkToReports("Планграфик ",config.api.getExportPlanGrafic);
            this.addLinkToReports("Отказы извещателей ", config.api.getExportOtkaziIzveshatelei);

            changePageTitle("Отчеты");
        };

        document.querySelector('.sidebar__export-plan_grafici').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.uneditableBuildingsPlanGrafikParameters.gridOptions,
                config.api.getBuildingsPlanGraf, null,
                agGridParameters.uneditableBuildingsPlanGrafikParameters.agName, this.actionMenu);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.unsetEditAndAddButtonAction();
            this.actionMenu.setExportPlanGrafAction();
            changePageTitle("План-графики");
        };
        document.querySelector('.sidebar__edit-plan_grafici').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.buildingsPlanGrafParameters.gridOptions,
                config.api.getBuildingsPlanGrafOrderedByPlGrafNumb, null,
                agGridParameters.buildingsPlanGrafParameters.agName, this.actionMenu);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.unsetEditAndAddButtonAction();
            this.actionMenu.setEditInnerMonthAction();
            this.actionMenu.setEditSequencePlanGrafAction();
            changePageTitle("План-графики");
        };
    }

    addLinkToReports(linkName, LinkURL) {
        let exportTestLiTag = document.createElement('li');
        exportTestLiTag.classList.add("export_list-item");
        this.reportList.appendChild(exportTestLiTag);
        let exportTestAtag = document.createElement('a');
        exportTestLiTag.appendChild(exportTestAtag);

        exportTestAtag.innerText = linkName;
        exportTestAtag.href = LinkURL;
    }
}





