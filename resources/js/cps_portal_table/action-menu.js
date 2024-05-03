import {config, downloadFile} from "./cps-portal-dao.js";
import {httpRequest} from "./cps-portal-dao.js";
import {addCSRF, changePageTitle} from "./helper.js";
import {agGridParameters} from "./ag-grid-parameters.js";
import TableAgGrid from "./aggrid";
import {userRole} from "./app";
import {lists} from "./lists";

export default class ActionMenu {
    tableAgGrid;
    modalForm;
    newTableRow;
    deleteTableRow;
    deleteAction;
    exportExcel;
    exportPassport;
    exportPlanGraf;
    checkPlusSix;
    checkPlusThree;
    checkPlusTwelve;
    innerEquipment;
    agBuildingId;
    agBuildingName;
    agBuildingFilterState;
    editTableRow;
    returnBack;
    addButtonActionEventLister;
    copyEquipToBuildingEventLister;
    innerMonth;
    planGrafSequence;
    arrangePlanGrafSequence;
    modalPutEquipmentInBuildingHtml;
    returnButtonAction;
    cashedAgGridBuildings;
    equipUsage;
    copyEquipOfBuilding;
    jsonExport;
    tepExport;


    hideALl() {
        this.newTableRow.style.display = 'none';
        this.deleteTableRow.style.display = 'none';
        this.exportExcel.style.display = 'none';
        this.checkPlusThree.style.display = 'none';
        this.checkPlusSix.style.display = 'none';
        this.checkPlusTwelve.style.display = 'none';
        this.innerEquipment.style.display = 'none';
        this.editTableRow.style.display = 'none';
        this.returnBack.style.display = 'none';
        this.exportPassport.style.display = 'none';
        this.exportPlanGraf.style.display = 'none';
        this.innerMonth.style.display = 'none';
        this.planGrafSequence.style.display = 'none';
        this.arrangePlanGrafSequence.style.display = 'none';
        this.equipUsage.style.display = 'none';
        this.copyEquipOfBuilding.style.display = 'none';
        this.jsonExport.style.display = 'none';
        this.tepExport.style.display = 'none';
    }

    hideTepExportButton() {
        this.tepExport.style.display = 'none';
    }

    showTepExportButton() {
        this.tepExport.style.display = 'block';
    }

    hideJsonExportButton() {
        this.jsonExport.style.display = 'none';
    }

    showJsonExportButton() {
        this.jsonExport.style.display = 'block';
    }

    hideCopyEquipOfBuildingButton() {
        this.copyEquipOfBuilding.style.display = 'none';
    }

    showCopyEquipOfBuildingButton() {
        this.copyEquipOfBuilding.style.display = 'block';
    }

    hideEquipUsageButton() {
        this.equipUsage.style.display = 'none';
    }

    showEquipUsageButton() {
        this.equipUsage.style.display = 'block';
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
        this.checkPlusSix.style.display = 'block';
    }

    showPlusThreeButton() {
        this.checkPlusThree.style.display = 'block';
    }

    showPlusTwelveButton() {
        this.checkPlusTwelve.style.display = 'block';
    }

    hidePlusSixButton() {
        this.checkPlusSix.style.display = 'none';
    }

    hidePlusThreeButton() {
        this.checkPlusThree.style.display = 'none';
    }

    hidePlusTwelveButton() {
        this.checkPlusTwelve.style.display = 'none';
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
        this.returnBack.style.display = 'block';
    }

    hideReturnToBuildingsButton() {
        this.returnBack.style.display = 'none';
    }

    hideAllOneRowAction() {
        this.hideDelButton();
        this.hidePlusSixButton();
        this.hidePlusThreeButton();
        this.hidePlusTwelveButton();
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

    setExportWorkersChecksDatesJsonAction() {
        this.showJsonExportButton();
        this.jsonExport.onclick = () => {
            let downloadLink = document.createElement("a");
            downloadLink.href = config.api.getExportAllNextWorkersChecksJson;
            downloadLink.click();
        }
    }

    setEditAndAddEquipOfBuildingButtonActionForNewEquipInBuildingModal() {
        this.editTableRow.removeEventListener('click', this.modalPutEquipmentInBuildingHtml);
        this.modalPutEquipmentInBuildingHtml = this.modalForm.setModalPutEquipmentInBuildingHtml.bind(this.modalForm);
        this.editTableRow.addEventListener('click', this.modalPutEquipmentInBuildingHtml);

        this.newTableRow.removeEventListener('click', this.addButtonActionEventLister);
        this.addButtonActionEventLister = this.modalForm.setModalNewEquipmentInBuildingHtml.bind(this.modalForm);
        this.newTableRow.addEventListener('click', this.addButtonActionEventLister);
    }


    setAddButtonActionForNewEquipment() {
        this.newTableRow.removeEventListener('click', this.addButtonActionEventLister);
        this.addButtonActionEventLister = this.modalForm.setModalCpsEquipmentFormHtml.bind(this.modalForm);
        this.newTableRow.addEventListener('click', this.addButtonActionEventLister);
    }

    setAddButtonActionForNewBuilding() {
        this.newTableRow.removeEventListener('click', this.addButtonActionEventLister);
        this.addButtonActionEventLister = this.modalForm.setModalCpsBuildingsFormHtml.bind(this.modalForm);
        this.newTableRow.addEventListener('click', this.addButtonActionEventLister);
    }

    setCopyEquipToBuildingAction() {
        this.copyEquipOfBuilding.removeEventListener('click', this.copyEquipToBuildingEventLister);
        this.copyEquipToBuildingEventLister = this.modalForm.setModalCopyEquipmentToBuildingFormHtml.bind(this.modalForm);
        this.copyEquipOfBuilding.addEventListener('click', this.copyEquipToBuildingEventLister);
    }

    setEquipUsageAction() {
        this.equipUsage.addEventListener('click', () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
            let equipItemId = selectedRow.id;
            this.tableAgGrid = new TableAgGrid(agGridParameters.uneditableEquipmentItemBuildingsUsageParameters.gridOptions,
                config.api.getEquipmentUsage + '/' +
                equipItemId, undefined, agGridParameters.uneditableEquipmentItemBuildingsUsageParameters.agName, this);
            this.hideALl();
            this.showExcelButton();
            changePageTitle(selectedRow.equip_name + ' используется:');
        });
    }

    setEditInnerAction() {
        this.setEditAndAddEquipOfBuildingButtonActionForNewEquipInBuildingModal();
        this.innerEquipment.onclick = () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
            this.agBuildingId = selectedRow.id;
            this.agBuildingName = selectedRow.shed;
            this.agBuildingFilterState = this.tableAgGrid.getAgFilterModel();
            this.tableAgGrid = new TableAgGrid(agGridParameters.equipmentInBuildingsParameters.gridOptions,
                config.api.getPutDeleteEquipmentInBuilding + '/' +
                this.agBuildingId, config.api.getPutDeleteEquipmentInBuilding, agGridParameters.equipmentInBuildingsParameters.agName, this);
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.hideALl();
            this.showPlusAndExcelButton();
            this.showReturnToBuildingsButton();
            this.modalForm.agBuildingName = this.agBuildingName;
            this.modalForm.agBuildingId = this.agBuildingId;

            changePageTitle('Здание =>' + selectedRow.group_1 + '=>' + selectedRow.shed + "=> Оборудование");

        };
    }

    setEditInnerMonthAction() {
        this.innerMonth.onclick = () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
            this.agBuildingId = selectedRow.id;
            this.agBuildingFilterState = this.tableAgGrid.getAgFilterModel();
            this.tableAgGrid = new TableAgGrid(agGridParameters.tehnObslMonthInBuildingsParameters.gridOptions,
                config.api.getPutDeleteEquipmentInBuilding + '/' +
                selectedRow.id, config.api.getPutDeleteEquipmentInBuilding, agGridParameters.tehnObslMonthInBuildingsParameters.agName, this);
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.hideALl();
            this.showReturnToBuildingsButton();
            changePageTitle('Здание =>' + selectedRow.group_1 + '=>' + selectedRow.shed + "=> ТО по месяцам");
            this.setReturnToPlanGrafEditingAction();
        };
    }

    setEditSequencePlanGrafAction() {
        this.planGrafSequence.onclick = () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
            this.agBuildingId = selectedRow.id;
            this.agBuildingFilterState = this.tableAgGrid.getAgFilterModel();
            this.tableAgGrid = new TableAgGrid(agGridParameters.buildingsPlanGrafSequnceParameters.gridOptions,
                config.api.getBuildingsPlanGrafOrderedById + '/' +
                selectedRow.id, config.api.getPutDeleteEquipmentInBuilding, agGridParameters.buildingsPlanGrafSequnceParameters.agName, this);
            this.showArrangePlanGrafSequenceButton();
            this.setArrangeBuildingInPlanGrafAction();
            this.showReturnToBuildingsButton();
            changePageTitle(' Изменение последовательности зданий в план-графике =>' + selectedRow.plan_graf_name);
            this.setReturnToPlanGrafEditingAction();
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


    setEditAddEquipOfBuildingButtonActionForNewEquipInBuilding() {
        this.modalForm.setEditAddEquipOfBuildingButtonActionForNewEquipInBuildingModal();
    }

    setReturnToBuildingsAction() {
        this.assignReturnButtonEventListener(this.returnToBuildingsAction);
    }

    setReturnToPlanGrafEditingAction() {
        this.assignReturnButtonEventListener(this.returnToPlanGrafEditingAction);
    }

    assignReturnButtonEventListener(returnButtonActonArg) {
        if (this.returnButtonAction !== undefined) {
            this.returnBack.removeEventListener('click', this.returnButtonAction);
        }
        this.returnButtonAction = returnButtonActonArg.bind(this);
        this.returnBack.addEventListener('click', this.returnButtonAction);
    }


    returnToPlanGrafEditingAction() {
        this.tableAgGrid = new TableAgGrid(agGridParameters.buildingsPlanGrafParameters.gridOptions,
            config.api.getBuildingsPlanGrafOrderedByPlGrafNumb, null,
            agGridParameters.buildingsPlanGrafParameters.agName, this, this.agBuildingId,
            this.agBuildingFilterState, undefined);
        this.modalForm.tableAgGrid = this.tableAgGrid;
        this.hideALl();
        changePageTitle("План-графики редактирование");
    }

    returnToBuildingsAction() {
        let cashedAgGridBuildings = undefined;
        if (userRole !== "super-user") {
            cashedAgGridBuildings = lists.buildings.all
        }
        this.tableAgGrid = new TableAgGrid(agGridParameters.uneditableBuildingsParameters.gridOptions,
            config.api.getBuildingsALl, config.api.postPutDeleteBuildings,
            agGridParameters.uneditableBuildingsParameters.agName, this, this.agBuildingId,
            this.agBuildingFilterState, cashedAgGridBuildings);
        this.modalForm.tableAgGrid = this.tableAgGrid;
        this.hideALl();
        this.showExcelButton();
        changePageTitle("Здания");
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
    setExportTepAction(){
        this.tepExport.onclick = () => {
            let selectedRow = this.tableAgGrid.getSelectedRow();
            let URL = config.api.getExportTep + '/' + selectedRow.id;

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
            requestBody.year_pl_gr = document.querySelector('#year_pl_gr').value;
            requestBody.who_approve_fio = document.querySelector('#who_approve_fio').value;
            requestBody.who_approve_position = document.querySelector('#who_approve_position').value;
            requestBody.who_assign_fio = document.querySelector('#who_assign_fio').value;
            requestBody.who_assign_position = document.querySelector('#who_assign_position').value;
            downloadFile(config.api.getExportPlanGrafic, "POST", addCSRF(requestBody));
        };
    }

    setPermissions() {
        this.cashedAgGridBuildings = userRole !== "super-user";
    }
}


