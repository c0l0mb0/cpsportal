import {config, downloadFile} from "./cps-portal-dao.js";
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
    exportPassport;
    exportPlanGraf;
    fireExamPlusSix;
    innerEquipment;
    agBuildingId;
    agBuildingName;
    editTableRow;
    returnToBuildings;
    EditButtonActionEventLister;
    AddButtonActionEventLister;
    innerMonth;
    planGrafSequence;
    arrangePlanGrafSequence;

    hideALl() {
        this.newTableRow.style.display = 'none';
        this.deleteTableRow.style.display = 'none';
        this.exportExcel.style.display = 'none';
        this.fireExamPlusSix.style.display = 'none';
        this.innerEquipment.style.display = 'none';
        this.editTableRow.style.display = 'none';
        this.returnToBuildings.style.display = 'none';
        this.exportPassport.style.display = 'none';
        this.exportPlanGraf.style.display = 'none';
        this.innerMonth.style.display = 'none';
        this.planGrafSequence.style.display = 'none';
        this.arrangePlanGrafSequence.style.display = 'none';
    }

    hideArrangePlanGrafSequenceButton() {
        this.arrangePlanGrafSequence.style.display = 'none';
    }

    showArrangePlanGrafSequenceButton() {
        this.arrangePlanGrafSequence.style.display = 'block';
    }

    hidePlanGrafSequenceMonthButton() {
        this.planGrafSequence.style.display = 'none';
    }

    showPlanGrafSequenceButton() {
        this.planGrafSequence.style.display = 'block';
    }

    hideInnerMonthButton() {
        this.innerMonth.style.display = 'none';
    }

    showInnerMonthButton() {
        this.innerMonth.style.display = 'block';
    }

    hidePlanGrafButton() {
        this.exportPlanGraf.style.display = 'none';
    }

    showPlanGrafButton() {
        this.exportPlanGraf.style.display = 'block';
    }

    hidePassportButton() {
        this.exportPassport.style.display = 'none';
    }

    showPassportButton() {
        this.exportPassport.style.display = 'block';
    }

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
        this.hidePassportButton();
        this.hidePlanGrafButton();
    }

    setExportExcelAction() {
        this.exportExcel.onclick = () => {
            this.tableAgGrid.exportDisplyedDataToExcel();
        };
    }

    setFireExamPlusSixAction() {
        this.fireExamPlusSix.onclick = () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
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
            this.setEditAddEquipOfBuildingButtonActionForNewEquipInBuilding();
        };
    }

    setEditInnerMonthAction() {
        this.innerMonth.onclick = () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
            this.tableAgGrid = new TableAgGrid(agGridParameters.tehnObslMonthInBuildingsParameters.gridOptions,
                config.api.getPutDeleteEquipmentInBuilding + '/' +
                selectedRow.id, config.api.getPutDeleteEquipmentInBuilding, agGridParameters.tehnObslMonthInBuildingsParameters.agName, this);
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.hideALl();
            changePageTitle('Здание =>' + selectedRow.group_1 + '=>' + selectedRow.shed + "=> ТО по месяцам");
        };
    }

    setEditSequencePlanGrafAction() {
        this.planGrafSequence.onclick = () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
            this.tableAgGrid = new TableAgGrid(agGridParameters.buildingsPlanGrafSequnceParameters.gridOptions,
                config.api.getBuildingsPlanGrafOrderedById + '/' +
                selectedRow.id, config.api.getPutDeleteEquipmentInBuilding, agGridParameters.buildingsPlanGrafSequnceParameters.agName, this);
            this.showArrangePlanGrafSequenceButton();
            this.setArrangeBuildingInPlanGrafAction();
            changePageTitle(' Изменение последовательности зданий в план-графике =>' + selectedRow.plan_graf_name);
        };
    }

    setArrangeBuildingInPlanGrafAction() {

        this.arrangePlanGrafSequence.onclick = () => {
            let requestBody = {};
            let buildingsSequence = [];
            this.tableAgGrid.gridOptions.api.forEachNode((rowNode) => {
                buildingsSequence.push(rowNode.data.id);
            });
            requestBody.plan_graf_name = this.tableAgGrid.gridOptions.api.getRowNode(0).data.plan_graf_name;
            requestBody.buildingsSequence = buildingsSequence;
            httpRequest(config.api.putUpdateBuildingSequenceOfPlanGraf, "PUT", addCSRF(requestBody)).then(() => {
                this.tableAgGrid.setGridData();
            }).catch((rejected) => console.log(rejected));
        }
    }

    setAddButtonActionForNewEquipment() {
        this.AddButtonActionEventLister = this.modalForm.setModalCpsEquipmentFormHtml.bind(this.modalForm);
        this.newTableRow.addEventListener('click', this.AddButtonActionEventLister);
    }


    setEditAddEquipOfBuildingButtonActionForNewEquipInBuilding() {
        this.EditButtonActionEventLister = this.modalForm.setModalPutEquipmentInBuildingHtml.bind(this.modalForm);
        this.AddButtonActionEventLister = this.modalForm.setModalNewEquipmentInBuildingHtml.bind(this.modalForm);
        this.editTableRow.addEventListener('click', this.EditButtonActionEventLister);
        this.newTableRow.addEventListener('click', this.AddButtonActionEventLister);
    }

    unsetEditAndAddButtonAction() {
        this.editTableRow.removeEventListener('click', this.EditButtonActionEventLister);
        this.newTableRow.removeEventListener('click', this.AddButtonActionEventLister);
    }

    setReturnToBuildingsAction() {
        this.returnToBuildings.onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.uneditableBuildingsParameters.gridOptions,
                config.api.getBuildingsALl, config.api.postPutDeleteBuildings,
                agGridParameters.uneditableBuildingsParameters.agName, this);
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.hideALl();
            // this.modalForm.setModalCpsBuildingsFormHtml();
            this.showExcelButton();
            this.setEditInnerAction();
            changePageTitle("Здания");
        };
    }

    setExportPassportAction() {
        this.exportPassport.onclick = () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
            let URL = config.api.getExportPassport + '/' + selectedRow.id;

            let downloadLink = document.createElement("a");
            downloadLink.href = URL;
            downloadLink.click();
        };
    }

    setExportPlanGrafAction() {
        this.exportPlanGraf.onclick = () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
            let requestBody = {};
            requestBody.plan_graf_name = selectedRow.plan_graf_name;
            downloadFile(config.api.getExportPlanGrafic, "POST", addCSRF(requestBody))
        };
    }

}


