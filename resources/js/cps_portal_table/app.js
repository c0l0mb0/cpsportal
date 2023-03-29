import ActionMenu from './action-menu.js'
import SideBar from './side-bar.js'
import ModalForm from './modal.js'
import {agGridParameters} from "./ag-grid-parameters.js";

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






