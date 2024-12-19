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

    // //set objects links to each other
    modalForm.actionMenu = actionMenu;
    actionMenu.modalForm = modalForm;
    sideBar.actionMenu = actionMenu;
    sideBar.modalForm = modalForm;
    sideBar.pageContent = document.querySelector('#page-content');
    sideBar.setButtonsActions();
    //
    agGridParameters.actionMenu = actionMenu;
    //
    // //assign links to buttons
    actionMenu.newTableRow = document.querySelector('.new-table-row');
    actionMenu.deleteTableRow = document.querySelector('.delete-table-row');
    actionMenu.exportExcel = document.querySelector('.excel-export');
    actionMenu.editTableRow = document.querySelector('.edit-table-row');
    actionMenu.importReminds = document.querySelector('.import-reminds ');

    let idleTimer = new IdleTimer();
}


function getAllValuesForLists() {

    httpRequest(config.api.getWorkersALl, 'GET').then((workersALl) => {
        lists.workers.all = workersALl;
    })
        .then(() => {
        init();
    }).catch((e) => {
        console.log(e);
    });


}






