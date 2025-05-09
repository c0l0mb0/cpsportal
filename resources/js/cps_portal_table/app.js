import ActionMenu from './action-menu.js'
import SideBar from './side-bar.js'
import ModalForm from './modal.js'
import {agGridParameters, initializeAgGridParameters} from "./page_content/ag-grid-parameters.js";
import {config, httpRequest} from "./cps-portal-dao";
import {lists} from "./lists";
import IdleTimer from "./idle-timer";

export let userRole = '';

getAllValuesForLists();

function init() {

    initializeAgGridParameters();

    let actionMenu = new ActionMenu();
    let modalForm = new ModalForm();
    let sideBar = new SideBar();
    let cashedEquipment = {}
    //set objects links to each other
    modalForm.actionMenu = actionMenu;
    actionMenu.modalForm = modalForm;
    sideBar.actionMenu = actionMenu;
    sideBar.modalForm = modalForm;

    sideBar.pageContent = document.querySelector('#page-content');
    //assign links to buttons
    actionMenu.newTableRow = document.querySelector('.new-table-row');
    actionMenu.deleteTableRow = document.querySelector('.delete-table-row');
    actionMenu.exportExcel = document.querySelector('.excel-export');
    actionMenu.checkPlusThree = document.querySelector('.plus-three-month');
    actionMenu.checkPlusSix = document.querySelector('.plus-six-month');
    actionMenu.checkPlusTwelve = document.querySelector('.plus-twelve-month');
    actionMenu.innerEquipment = document.querySelector('.inner-equip');
    actionMenu.editTableRow = document.querySelector('.edit-table-row');
    actionMenu.returnBack = document.querySelector('.return-back');
    actionMenu.exportPassport = document.querySelector('.excel-export-passport');
    actionMenu.exportPlanGraf = document.querySelector('.excel-export-plangrafic');
    actionMenu.innerMonth = document.querySelector('.excel-inner-month');
    actionMenu.planGrafSequence = document.querySelector('.plangraf-sequence');
    actionMenu.arrangePlanGrafSequence = document.querySelector('.plangraf-arrange-numbers');
    actionMenu.equipUsage = document.querySelector('.equip-usage');
    actionMenu.copyEquipOfBuilding = document.querySelector('.copy-all-building-equipment');
    actionMenu.jsonExport = document.querySelector('.json-export');
    actionMenu.tepExport = document.querySelector('.excel-export-tep');
    actionMenu.copyPathToProject = document.querySelector('.copy-path-to-project ');

    sideBar.setPermissions();
    actionMenu.setPermissions();
    sideBar.setButtonsActions();

    agGridParameters.actionMenu = actionMenu;



    let idleTimer = new IdleTimer();
}


function getAllValuesForLists() {

    httpRequest(config.api.getUserRoles, 'GET').then((userRoleResponse) => {
        userRole = userRoleResponse;
        return httpRequest(config.api.getBuildingsGroup1, 'GET');
    }).then((buildingsGroup1Data) => {
        lists.buildings.group_1 = buildingsGroup1Data;
        return httpRequest(config.api.getBuildingsGroup2, 'GET');
    }).then((buildingsGroup2Data) => {
        lists.buildings.group_2 = buildingsGroup2Data;
        return httpRequest(config.api.getBuildingsAffiliate, 'GET');
    }).then((buildingsAffiliateData) => {
        buildingsAffiliateData.forEach((elem) => {
            lists.buildings.affiliate.push(elem.affiliate);
        });
        return httpRequest(config.api.getBuildingsPlanGraf, 'GET');
    }).then((buildingsPlanGraf) => {
        buildingsPlanGraf.forEach((elem) => {
            lists.buildings.planGraf.push(elem.plan_graf_name);
        });
        return httpRequest(config.api.getEquipmentALl, 'GET');
    }).then((equipmentALl) => {
        lists.equipment.all = equipmentALl;
        return httpRequest(config.api.getBuildingsALl, 'GET');
    }).then((buildingALl) => {
        lists.buildings.all = buildingALl;
        return httpRequest(config.api.getWorkersALl, 'GET');
    }).then((workersALl) => {
        lists.workers.all = workersALl;
    })
        .then(() => {
        init();
    }).catch((e) => {
        console.log(e);
    });


}






