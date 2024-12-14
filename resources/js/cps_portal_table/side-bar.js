import TableAgGrid from './page_content/aggrid.js'
import {config, httpRequest} from './cps-portal-dao.js'
import {addCSRF, changePageTitle} from './helper.js'
import {agGridParameters} from './page_content/ag-grid-parameters.js'
import {userRole} from './app.js'
import {lists} from "./lists";
import {createExamCalendarForm} from "./page_content/exam-calendar";
import {createDeleteDuplicatesForm} from "./page_content/delete_duplicates";
import {createPlanGrafForm} from "./page_content/plan-graf-menu";
import {createReportsForm} from "./page_content/reports";
import Exam from "./page_content/exam";
import ActInvestigation from "./page_content/act-investigation";


export default class SideBar {
    tableAgGrid;
    actionMenu;
    modalForm;
    cashedAgGridBuildings = undefined;
    cashedAgGridEquipment = undefined;
    pageContent;

    setPermissions() {
        if (userRole === "super-user") {
            document.querySelector('.sidebar__edit-equip').hidden = false;
            document.querySelector('.sidebar__edit-buildings').hidden = false;
            document.querySelector('.sidebar__export-reports').hidden = false;
            document.querySelector('.sidebar__export-plan_grafici').hidden = false;
            document.querySelector('.sidebar__edit-plan_grafici').hidden = false;
            document.querySelector('.sidebar__edit-equip-in-building').hidden = false;
            // document.querySelector('.sidebar__delete-duplicates').hidden = false;
            document.querySelector('.sidebar__edit-schedule').hidden = false;
            document.querySelector('.sidebar__edit-schedule-calendar').hidden = false;
            // document.querySelector('.sidebar__warehouse-workers').hidden = false;
            // document.querySelector('.sidebar__warehouse-reminders').hidden = false;
            // document.querySelector('.sidebar__exam').hidden = false;
            document.querySelector('.sidebar__act_investigate').hidden = false;
        } else {
            document.querySelector('.sidebar__edit-equip-in-building').hidden = false;
            // document.querySelector('.sidebar__exam').hidden = false;
            this.cashedAgGridBuildings = lists.buildings.all;
            this.cashedAgGridEquipment = lists.equipment.all;
            // document.querySelector('.sidebar__edit-plan_grafici').hidden = false;
        }
    }

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

        document.querySelector('.sidebar__edit-schedule').onclick = () => {
            this.clearPageContent();
            this.tableAgGrid = new TableAgGrid(agGridParameters.cpsScheduleParameters.gridOptions,
                config.api.getWorkersALl, config.api.postPutDeleteWorkers,
                agGridParameters.cpsScheduleParameters.agName, this.actionMenu);
            this.linksTableAgGridWithActionMenuAndModalForm();
            this.actionMenu.setExportWorkersChecksDatesJsonAction();
            changePageTitle("Проверки работников. Красное - просрочено");
        };
        document.querySelector('.sidebar__edit-equip').onclick = () => {
            this.clearPageContent();
            this.tableAgGrid = new TableAgGrid(agGridParameters.equipmentParameters.gridOptions,
                config.api.getEquipmentALl, config.api.postPutDeleteEquipment,
                agGridParameters.equipmentParameters.agName, this.actionMenu, undefined,
                undefined, undefined);
            this.linksTableAgGridWithActionMenuAndModalForm();
            this.actionMenu.setAddButtonActionForNewEquipment();
            this.actionMenu.setEquipUsageAction();
            this.actionMenu.showPlusAndExcelButton();
            changePageTitle("Оборудование");
        };

        document.querySelector('.sidebar__edit-buildings').onclick = () => {
            this.clearPageContent();
            this.tableAgGrid = new TableAgGrid(agGridParameters.buildingsParameters.gridOptions,
                config.api.getBuildingsALl, config.api.postPutDeleteBuildings,
                agGridParameters.buildingsParameters.agName, this.actionMenu, undefined,
                undefined, undefined);
            this.linksTableAgGridWithActionMenuAndModalForm();
            this.actionMenu.setAddButtonActionForNewBuilding();
            this.actionMenu.showPlusAndExcelButton();
            this.actionMenu.setExportPassportAction();
            this.actionMenu.setExportTepAction();
            this.actionMenu.setCopyPathToProjectButtonAction();


            changePageTitle("Здания");
        };
        document.querySelector('.sidebar__edit-equip-in-building').onclick = () => {
            this.clearPageContent();
            this.tableAgGrid = new TableAgGrid(agGridParameters.uneditableBuildingsParameters.gridOptions,
                config.api.getBuildingsALl, config.api.postPutDeleteBuildings,
                agGridParameters.uneditableBuildingsParameters.agName, this.actionMenu, undefined,
                undefined, this.cashedAgGridBuildings);
            this.linksTableAgGridWithActionMenuAndModalForm();
            this.actionMenu.showExcelButton();
            this.actionMenu.setEditInnerAction();
            this.actionMenu.setCopyEquipToBuildingAction();
            this.actionMenu.setReturnToBuildingsAction();

            changePageTitle("Оборудование в здании");
        };


        document.querySelector('.sidebar__export-reports').onclick = () => {
            this.actionMenu.hideALl();
            this.clearPageContent();
            createReportsForm(this.pageContent);
            changePageTitle("Отчеты");
        };

        document.querySelector('.sidebar__edit-plan_grafici').onclick = () => {
            this.clearPageContent();
            this.tableAgGrid = new TableAgGrid(agGridParameters.buildingsPlanGrafParameters.gridOptions,
                config.api.getBuildingsPlanGrafOrderedByPlGrafNumb, null,
                agGridParameters.buildingsPlanGrafParameters.agName, this.actionMenu, undefined,
                undefined, undefined);
            this.linksTableAgGridWithActionMenuAndModalForm();
            this.actionMenu.setEditInnerMonthAction();
            this.actionMenu.setEditSequencePlanGrafAction();
            changePageTitle("План-графики редактирование");
        };

        document.querySelector('.sidebar__export-plan_grafici').onclick = () => {
            this.clearPageContent();
            this.tableAgGrid = new TableAgGrid(agGridParameters.uneditableBuildingsPlanGrafikParameters.gridOptions,
                config.api.getBuildingsPlanGraf, null,
                agGridParameters.uneditableBuildingsPlanGrafikParameters.agName, this.actionMenu, undefined,
                undefined, undefined);
            this.linksTableAgGridWithActionMenuAndModalForm();
            this.actionMenu.setExportPlanGrafAction();
            changePageTitle("План-графики экспорт");
            createPlanGrafForm(this.pageContent);
        };

        document.querySelector('.sidebar__delete-duplicates').onclick = () => {
            changePageTitle("Удаление дубликатов оборудования");
            this.clearPageContent();
            createDeleteDuplicatesForm(this.pageContent);
        };

        document.querySelector('.sidebar__edit-schedule-calendar').onclick = () => {
            this.actionMenu.hideALl();
            this.clearPageContent();
            changePageTitle("Расписание проверок");
            createExamCalendarForm(this.pageContent);
        };

        document.querySelector('.sidebar__exam').onclick = () => {
            this.actionMenu.hideALl();
            this.clearPageContent();
            changePageTitle("Экзамен");
            let exam = new Exam(this.pageContent);
        };

        document.querySelector('.sidebar__act_investigate').onclick = () => {
            this.actionMenu.hideALl();
            this.clearPageContent();
            changePageTitle("Создание акта");
            let exam = new ActInvestigation(this.pageContent);
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





