import ActionMenu from './action-menu.js'
import SideBar from './side-bar.js'
import ModalForm from './modal.js'
import {agGridParameters} from "./ag-grid-parameters.js";
import {config, httpRequest} from "./cps-portal-dao";
import {lists} from "./lists";


getAllValuesForLists();

function init() {
    let actionMenu = new ActionMenu();
    let modalForm = new ModalForm();
    let sideBar = new SideBar();

    //set objects links to each other
    modalForm.actionMenu = actionMenu;
    actionMenu.modalForm = modalForm;
    sideBar.actionMenu = actionMenu;
    sideBar.modalForm = modalForm;
    sideBar.setButtonsActions();

    agGridParameters.actionMenu = actionMenu;

    //assign links to buttons
    actionMenu.newTableRow = document.querySelector('.new-table-row');
    actionMenu.deleteTableRow = document.querySelector('.delete-table-row');
    actionMenu.exportExcel = document.querySelector('.excel-export');
    actionMenu.fireExamPlusSix = document.querySelector('.plus-six-month');
    actionMenu.innerEquipment = document.querySelector('.inner-equip');
    actionMenu.editTableRow = document.querySelector('.edit-table-row');
    actionMenu.returnToBuildings = document.querySelector('.return-buildings');

    actionMenu.hideALl();
}

function getAllValuesForLists() {
    httpRequest(config.api.getBuildingsGroup1, 'GET').then((buildingsGroup1Data) => {
        buildingsGroup1Data.forEach((elem) => {
            lists.buildings.group_1 = lists.buildings.group_1 + ('<option value="' + elem.group_1 + '">' + elem.area + ' | ' + elem.group_1 + '</option>' + '\n');
        });
        return httpRequest(config.api.getBuildingsGroup2, 'GET');
    }).then((buildingsGroup2Data) => {
        const emptyOption = '<option value="">без подгруппы</option>';
        lists.buildings.group_2 = lists.buildings.group_2 + emptyOption;
        buildingsGroup2Data.forEach((elem) => {
            lists.buildings.group_2 = lists.buildings.group_2 + ('<option value="' + elem.group_2 + '">' + elem.area + ' | ' + elem.group_2 + '</option>' + '\n');
        });
        return httpRequest(config.api.getBuildingsAffiliate, 'GET');
    }).then((buildingsAffiliateData) => {
        buildingsAffiliateData.forEach((elem) => {
            lists.buildings.affiliate = lists.buildings.affiliate + ('<option value="' + elem.affiliate + '">' + elem.affiliate + '</option>' + '\n');
        });
    }).then(() => {
        init();
    }).catch((e) => {
        console.log(e);
    });


}






