import {config} from "./cps-portal-dao.js";
import {httpRequest} from "./cps-portal-dao.js";
import {addCSRF, changePageTitle} from "./helper.js";
import {agGridParameters} from "./ag-grid-parameters.js";
import TableAgGrid from "./aggrid";

export default class ActionMenu {
    tableAgGrid;
    modalForm;
    newTableRow;
    deleteTableRow;
    deleteAction;
    exportExcel;
    fireExamPlusSix;
    innerEquipment;
    agBuildingId;
    agBuildingName;
    editTableRow;
    returnToBuildings;

    hideALl() {
        this.newTableRow.style.display = 'none';
        this.deleteTableRow.style.display = 'none';
        this.exportExcel.style.display = 'none';
        this.fireExamPlusSix.style.display = 'none';
        this.innerEquipment.style.display = 'none';
        this.editTableRow.style.display = 'none';
        this.returnToBuildings.style.display = 'none';
    }

    ////
    showExcelButton() {
        this.exportExcel.style.display = 'block';
    }

    showPlusAndExcelButton() {
        this.newTableRow.style.display = 'block';
        this.exportExcel.style.display = 'block';
    }

    showPlusSixButton() {
        this.fireExamPlusSix.style.display = 'block';
    }

    hidePlusSixButton() {
        this.fireExamPlusSix.style.display = 'none';
    }

    showDelButton() {
        this.deleteTableRow.style.display = 'block';
    }

    hideDelButton() {
        this.deleteTableRow.style.display = 'none';
    }

    showEditButton() {
        this.editTableRow.style.display = 'block';
    }

    hideEditButton() {
        this.editTableRow.style.display = 'none';
    }

    showGoToEquipButton() {
        this.innerEquipment.style.display = 'block';
    }

    hideGoToEquipButton() {
        this.innerEquipment.style.display = 'none';
    }

    showReturnToBuildingsButton() {
        this.returnToBuildings.style.display = 'block';
    }

    hideReturnToBuildingsButton() {
        this.returnToBuildings.style.display = 'none';
    }

    hideAllOneRowAction() {
        this.hideDelButton();
        this.hidePlusSixButton();
        this.hideEditButton();
        this.hideGoToEquipButton();
    }

    setExportExcelAction() {
        this.exportExcel.onclick = () => {
            this.tableAgGrid.exportDisplyedDataToExcel();
        };
    }

    setFireExamPlusSixAction() {
        this.fireExamPlusSix.onclick = () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
            console.log(selectedRow);
            httpRequest(config.api.postWorkersAddSixMonth, "POST", addCSRF(selectedRow)).then(() => {
                this.tableAgGrid.setGridData();
            }).catch((rejected) => console.log(rejected));
        }
    }

    setEditInnerAction() {
        this.innerEquipment.onclick = () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
            this.agBuildingId = selectedRow.id;
            this.agBuildingName = selectedRow.shed;
            this.tableAgGrid = new TableAgGrid(agGridParameters.equipmentInBuildingsParameters.gridOptions,
                config.api.getPutDeleteEquipmentInBuilding + '/' +
                this.agBuildingId, config.api.getPutDeleteEquipmentInBuilding, agGridParameters.equipmentInBuildingsParameters.agName, this);
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.hideALl();
            this.showPlusAndExcelButton();
            this.showReturnToBuildingsButton();
            this.setReturnToBuildingsAction();
            this.modalForm.agBuildingName = this.agBuildingName;
            this.modalForm.agBuildingId = this.agBuildingId;

            changePageTitle('Здание =>' + selectedRow.group_1 + '=>' + selectedRow.shed + "=> Оборудование");
            this.setEditEquipOfBuildingButtonAction();
            this.setAddEquipToBuildingButtonAction();
        };
    }

    setEditEquipOfBuildingButtonAction() {
        this.editTableRow.addEventListener('click', this.modalForm.setModalPutEquipmentInBuildingHtml.bind(this.modalForm));
    }

    setAddEquipToBuildingButtonAction() {
        this.newTableRow.addEventListener('click', this.modalForm.setModalNewEquipmentInBuildingHtml.bind(this.modalForm));
    }

    setReturnToBuildingsAction() {
        this.returnToBuildings.onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.buildingsParameters.gridOptions,
                config.api.getBuildingsALl, config.api.postPutDeleteBuildings,
                agGridParameters.buildingsParameters.agName, this);
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.hideALl();
            this.modalForm.setModalCpsBuildingsFormHtml();
            this.showPlusAndExcelButton();
            this.setEditInnerAction();
            changePageTitle("Здания");
        };
    }

}


