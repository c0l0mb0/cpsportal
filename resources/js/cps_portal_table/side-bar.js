import TableAgGrid from './aggrid.js'
import {config, httpRequest} from './cps-portal-dao.js'
import {addCSRF, changePageTitle} from './helper.js'
import {agGridParameters} from './ag-grid-parameters.js'
import {userRole} from './app.js'
import {lists} from "./lists";


export default class SideBar {
    tableAgGrid;
    actionMenu;
    modalForm;
    reportList;
    menuPlanGraf;
    cashedAgGridBuildings = undefined;
    cashedAgGridEquipment = undefined;

    setPermissions() {
        if (userRole === "super-user") {
            document.querySelector('.sidebar__edit-equip').hidden = false;
            document.querySelector('.sidebar__edit-buildings').hidden = false;
            document.querySelector('.sidebar__export-reports').hidden = false;
            document.querySelector('.sidebar__export-plan_grafici').hidden = false;
            document.querySelector('.sidebar__edit-plan_grafici').hidden = false;
            document.querySelector('.sidebar__edit-equip-in-building').hidden = false;
            document.querySelector('.sidebar__delete-duplicates').hidden = false;
        } else {
            document.querySelector('.sidebar__edit-equip-in-building').hidden = false;
            this.cashedAgGridBuildings = lists.buildings.all;
            this.cashedAgGridEquipment = lists.equipment.all;
            // document.querySelector('.sidebar__edit-plan_grafici').hidden = false;
        }
    }

    setButtonsActions() {
        document.getElementById('sidebarCollapse').onclick = () => {
            document.getElementById('sidebar').classList.toggle("active");
        };

        document.querySelector('.sidebar__edit-schedule').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.cpsScheduleParameters.gridOptions,
                config.api.getWorkersALl, config.api.postPutDeleteWorkers,
                agGridParameters.cpsScheduleParameters.agName, this.actionMenu);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            // this.modalForm.setModalWorkersFormHtml();
            // this.actionMenu.showPlusAndExcelButton();
            // this.modalForm.setFormWithTexboxesSubmitHandler();
            if (this.menuPlanGraf !== undefined) {
                this.menuPlanGraf.remove();
            }

            changePageTitle("Работники");
        };

        // document.querySelector('.sidebar__edit-fire_instr').onclick = () => {
        //     this.tableAgGrid = new TableAgGrid(agGridParameters.fireInstrParameters.gridOptions,
        //         config.api.getWorkersALl, config.api.postPutDeleteWorkers,
        //         agGridParameters.fireInstrParameters.agName, this.actionMenu);
        //     this.actionMenu.tableAgGrid = this.tableAgGrid;
        //     this.modalForm.tableAgGrid = this.tableAgGrid;
        //     this.actionMenu.showExcelButton();
        //     this.actionMenu.setFireExamPlusSixAction();
        //     this.modalForm.setFormWithTexboxesSubmitHandler();
        //     this.removeMenuPlanGraf();
        //     changePageTitle("Пожинструктаж");
        // };
        document.querySelector('.sidebar__edit-equip').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.equipmentParameters.gridOptions,
                config.api.getEquipmentALl, config.api.postPutDeleteEquipment,
                agGridParameters.equipmentParameters.agName, this.actionMenu, undefined,
                undefined, undefined);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.setAddButtonActionForNewEquipment();
            this.actionMenu.setEquipUsageAction();
            this.actionMenu.showPlusAndExcelButton();
            this.removeMenuPlanGraf();
            changePageTitle("Оборудование");
        };

        document.querySelector('.sidebar__edit-buildings').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.buildingsParameters.gridOptions,
                config.api.getBuildingsALl, config.api.postPutDeleteBuildings,
                agGridParameters.buildingsParameters.agName, this.actionMenu, undefined,
                undefined, undefined);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.setAddButtonActionForNewBuilding();
            this.actionMenu.showPlusAndExcelButton();
            this.actionMenu.setExportPassportAction();
            this.removeMenuPlanGraf();

            changePageTitle("Здания");
        };
        document.querySelector('.sidebar__edit-equip-in-building').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.uneditableBuildingsParameters.gridOptions,
                config.api.getBuildingsALl, config.api.postPutDeleteBuildings,
                agGridParameters.uneditableBuildingsParameters.agName, this.actionMenu, undefined,
                undefined, this.cashedAgGridBuildings);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.showExcelButton();
            this.actionMenu.setEditInnerAction();
            this.actionMenu.setCopyEquipToBuildingAction();
            this.actionMenu.setReturnToBuildingsAction();
            this.removeMenuPlanGraf();
            changePageTitle("Оборудование в здании");
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
            this.addLinkToReports("Все данные", config.api.getExportAllData);
            this.addLinkToReports("Отказы извещателей ", config.api.getExportOtkaziIzveshatelei);
            this.removeMenuPlanGraf();
            changePageTitle("Отчеты");
        };
        document.querySelector('.sidebar__edit-plan_grafici').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.buildingsPlanGrafParameters.gridOptions,
                config.api.getBuildingsPlanGrafOrderedByPlGrafNumb, null,
                agGridParameters.buildingsPlanGrafParameters.agName, this.actionMenu, undefined,
                undefined, undefined);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.setEditInnerMonthAction();
            this.actionMenu.setEditSequencePlanGrafAction();
            this.removeMenuPlanGraf();
            changePageTitle("План-графики редактирование");
        };
        document.querySelector('.sidebar__export-plan_grafici').onclick = () => {
            this.tableAgGrid = new TableAgGrid(agGridParameters.uneditableBuildingsPlanGrafikParameters.gridOptions,
                config.api.getBuildingsPlanGraf, null,
                agGridParameters.uneditableBuildingsPlanGrafikParameters.agName, this.actionMenu, undefined,
                undefined, undefined);
            this.actionMenu.tableAgGrid = this.tableAgGrid;
            this.modalForm.tableAgGrid = this.tableAgGrid;
            this.actionMenu.setExportPlanGrafAction();
            changePageTitle("План-графики экспорт");
            this.removeMenuPlanGraf();
            this.insertPlanGrafMenu();
        };

        document.querySelector('.sidebar__delete-duplicates').onclick = () => {
            this.insertDeleteDuplicatesHTML();
        };


    }

    removeMenuPlanGraf() {
        if (this.menuPlanGraf !== undefined) {
            this.menuPlanGraf.remove();
        }
    }

    insertDeleteDuplicatesHTML() {
        const pageContent = document.querySelector('#page-content');
        while (pageContent.firstChild) {
            pageContent.removeChild(pageContent.firstChild);
        }
        this.duplicatesDelMenu = document.createElement('div');
        this.duplicatesDelMenu.setAttribute("id", "duplicate-menu");
        this.duplicatesDelMenu.setAttribute('style', 'display:flex; flex-direction: column; height: 100%;');
        this.duplicatesDelMenu.innerHTML = `
                <div class='duplicate_menu_upper_part'>
                     <div class="row p-2">
                            <div class="col-1">
                                <label for="equip_remain" class="col-form-label">Остается</label>
                            </div>
                            <div class="col-1">
                                 <input type="text" class="form-control" id="equip_remain_id"  name="equip_remain_id" readonly>

                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="equip_remain"  name="equip_remain" readonly>

                            </div>
                     </div>

                     <div class="row p-2">
                            <div class="col-1">
                                <label for="equip_to_del" class="col-form-label">Удаляется</label>
                            </div>
                            <div class="col-1">
                                 <input type="text" class="form-control" id="equip_to_del_id"  name="equip_to_del_id" readonly>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="equip_to_del"  name="equip_to_del" readonly>
                            </div>
                     </div>
                </div>
                <div class="row p-2">
                    <div class="col-sm">
                        <button type="button" class="btn btn-primary " id="btn_equip_remain">Оставить</button>
                    </div>
                    <div class="col-sm">
                        <button type="button" class="btn btn-success" id="btn_equip_to_del">Удалить</button>
                    </div>
                    <div class="col-sm-8">
                        <div class="row justify-content-center">
                            <button type="button" class="btn btn-danger" id="btn_del_equip_duplicate">Выполнить</button>
                        </div>
                    </div>
                </div>
                <div class='duplicate_menu_bottom_part' style="display:flex; height: 100%;">
                    <div id="duplicate_menu_bottom_part__left_agGrid" ">
                    </div>
                    <div id="duplicate_menu_bottom_part__right_agGrid" ">
                    </div>
                </div>
        `
        pageContent.prepend(this.duplicatesDelMenu);
        let tableAgGridRemain = new TableAgGrid(agGridParameters.uneditableEquipmentParameters.gridOptions,
            config.api.getEquipmentALl, config.api.postPutDeleteEquipment,
            agGridParameters.equipmentParameters.agName, this.actionMenu, undefined,
            undefined, undefined, "duplicate_menu_bottom_part__left_agGrid");
        let tableAgGridToDel = new TableAgGrid(agGridParameters.uneditableEquipmentParameters2.gridOptions,
            config.api.getEquipmentALl, config.api.postPutDeleteEquipment,
            agGridParameters.equipmentParameters.agName, this.actionMenu, undefined,
            undefined, undefined, 'duplicate_menu_bottom_part__right_agGrid');
        document.querySelector('#btn_equip_remain').onclick = () => {
            let selectedRow = tableAgGridRemain.getSelectedRow();
            if (selectedRow !== undefined) {
                document.querySelector('#equip_remain_id').value = selectedRow.id;
                document.querySelector('#equip_remain').value = selectedRow.equip_name;
            }

        }
        document.querySelector('#btn_equip_to_del').onclick = () => {
            let selectedRow = tableAgGridToDel.getSelectedRow();
            if (selectedRow !== undefined) {
                document.querySelector('#equip_to_del_id').value = selectedRow.id;
                document.querySelector('#equip_to_del').value = selectedRow.equip_name;
            }

        }
        document.querySelector('#btn_del_equip_duplicate').onclick = () => {
            let idEquipToDel = document.querySelector('#equip_to_del_id').value;
            let idEquipRemain = document.querySelector('#equip_remain_id').value;
            if (idEquipToDel === '' || idEquipRemain === '') {
                throw ('empty idEquipToDel or idEquipRemain')
            }
            if (idEquipToDel === idEquipRemain) {
                throw ('idEquipToDel is equal to idEquipRemain')
            }
            let requestData = {};
            requestData.id_equip_to_del = idEquipToDel;
            requestData.id_equip_remain = idEquipRemain;
            requestData = addCSRF(requestData);
            httpRequest(config.api.postDeleteEquipDuplicates, 'POST', requestData).then((e) => {

            }).catch((e) => {
                console.log(e);
            });
        }
    }

    insertPlanGrafMenu() {
        const pageContent = document.querySelector('.app-container');
        this.menuPlanGraf = document.createElement('duplicate_menu_bottom_part__left_agGrid');
        this.menuPlanGraf.setAttribute("id", "menuPlanGraf");
        this.menuPlanGraf.innerHTML = `
                    <div class="d-inline">
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="year_pl_gr" class="col-form-label">Год</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="year_pl_gr" required  name="year_pl_gr">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="who_approve_fio" class="col-form-label">Утвердил ФИО</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="who_approve_fio" required  name="who_approve_fio">
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="who_approve_position" class="col-form-label">Утвердил Должность</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="who_approve_position" required  name="who_approve_position">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="who_assign_fio" class="col-form-label">Составл ФИО</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="who_assign_fio"  required name="who_assign_fio">
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="who_assign_position" class="col-form-label">Подписал Должность</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="who_assign_position" required text="Зам.нач. цеха" name="who_assign_position">
                            </div>
                        </div>
                    </div>
            `
        pageContent.prepend(this.menuPlanGraf);
        document.querySelector('#year_pl_gr').value = "2024";
        document.querySelector('#who_approve_fio').value = "А.Н. Ильин";
        document.querySelector('#who_approve_position').value = "Зам.нач. цеха";
        document.querySelector('#who_assign_fio').value = "Д.С. Коротун";
        document.querySelector('#who_assign_position').value = "Нач.участка";
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





