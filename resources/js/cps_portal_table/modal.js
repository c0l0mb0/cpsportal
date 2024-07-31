import {config} from './cps-portal-dao.js'
import {httpRequest} from './cps-portal-dao.js'
import {addCSRF} from './helper.js'
import ModalAggrid from "./modal-aggrid.js";
import {agGridParameters} from "./page_content/ag-grid-parameters";
import {lists} from "./lists";
import {userRole} from "./app";

export default class ModalForm {
    actionMenu;
    tableAgGrid;
    modalTableAgGrid;
    agBuildingId;
    agBuildingName;
    modalHtml = {};
    ui = {
        modalForm: {
            caption: document.getElementById('modal__caption'),
            modal: document.getElementById('modal__new-entry'),
            modalBody: document.querySelector('.modal__form__body'),
            modalForm: document.querySelector('.modal-form'),
            form: document.getElementById('form__new-entry'),
            error: document.getElementById('form__error'),
            listsArea: undefined,
            group_1: undefined,
            group_2: undefined,
            kind_app: undefined,
            kind_app_second: undefined,

        },
        modalContainer: document.querySelector('.modal-container'),
        showModalButton: document.querySelector('.new-table-row'),
        modalDialog: document.querySelector('.modal-dialog'),
        requestUrl: undefined,
        requestMethod: 'POST',
        modalFormPurpose: undefined,
    };
    putId;

    constructor() {
        this.initiateModalHtml();
        this.setFormSubmitHandler();
    }

    addExtraValuesRequestData(RequestData) {
        if (this.ui.modalFormPurpose === 'buildings') {
            RequestData.on_conserv = false;
        }
        if (this.ui.modalFormPurpose === 'editEquipmentInBuilding' || this.ui.modalFormPurpose === 'addEquipmentInBuilding') {
            RequestData.id_build = this.agBuildingId;
        }
    }

    setRequestData() {
        let requestData = {};
        for (const child of this.ui.modalForm.modalBody.children) {
            if (child.classList.contains('modal-aggrid-wrapper')) {
                let selectedRow = this.modalTableAgGrid.getSelectedRow();
                if (selectedRow === undefined) {
                    this.errorModalAgGridItemSelect();
                }
                if (this.ui.modalFormPurpose === 'newEquipment' || this.ui.modalFormPurpose === 'editEquipmentInBuilding' ||
                    this.ui.modalFormPurpose === 'addEquipmentInBuilding') {
                    requestData.id_equip = selectedRow.id;
                }
                if (this.ui.modalFormPurpose === 'copyEquipFromBuilding') {
                    requestData.id_build_to = selectedRow.id;
                    requestData.id_build_from = this.tableAgGrid.getSelectedRow().id;
                }
                if (this.ui.modalFormPurpose === 'editEquipmentInBuilding') {
                    let selectedRowEquipInBuilding = this.tableAgGrid.getSelectedRow();
                    requestData.quantity = selectedRowEquipInBuilding.quantity;
                    requestData.measure = selectedRowEquipInBuilding.measure;
                    requestData.id_build = selectedRowEquipInBuilding.id_build;
                    this.putId = selectedRowEquipInBuilding.id;
                    if (requestData.quantity === 0) {
                        let massage = {};
                        massage.status = 'ошибка ввода';
                        massage.statusText = 'количество равно 0';
                        this._showError(massage);
                        throw('quantity===0');
                    }
                }
            }
        }
        const formInputs = Array.from(this.ui.modalForm.modalForm.getElementsByClassName('form-control'));
        formInputs.forEach((element) => {
            if (element.id !== 'aggrid_search' && element.value !== '') {
                requestData[element.id] = element.value;
            }
        });
        requestData = addCSRF(requestData);
        this.addExtraValuesRequestData(requestData);
        return requestData;
    }

    errorModalAgGridItemSelect() {
        this._hideError();
        let massage = {}
        if (this.ui.modalFormPurpose === 'copyEquipFromBuilding' || this.ui.modalFormPurpose === 'buildings'
        ) {
            massage.status = 'ошибка ввода'
            massage.statusText = 'здание не выбрано'
        }
        if (this.ui.modalFormPurpose === 'newEquipment' || this.ui.modalFormPurpose === 'editEquipmentInBuilding' ||
            this.ui.modalFormPurpose === 'addEquipmentInBuilding') {
            massage.status = 'ошибка ввода'
            massage.statusText = 'прибор не выбран'
        }
        this._showError(massage);
        throw 'ошибка ввода'
    }

    modalFormCallback = event => {
        event.preventDefault();
        try {
            let requestData = this.setRequestData();
            let requestUrl = this.ui.modalForm.requestUrl;
            if (this.ui.modalForm.requestMethod === 'PUT') {
                if (this.putId === undefined) {
                    throw ('putId error');
                }
                requestUrl += '/' + this.putId;
            }
            let _this = this;
            httpRequest(requestUrl, this.ui.modalForm.requestMethod, requestData).then((e) => {
                _this._hideError();
                _this.hideModal();
                event.target.reset();
                _this.tableAgGrid.setAndScrollToId(e.id);
                _this.actionMenu.hideAllOneRowAction();
                _this.ui.modalFormPurpose = undefined;
            }).catch((e) => {
                _this._hideError();
                _this._showError(e);
            });
        } catch (e) {
            console.log(e);
        }

    }

    setFormSubmitHandler() {
        this.ui.modalForm.form.addEventListener('submit', this.modalFormCallback);
    }

    _showError(message) {
        if (message.status === 409) {
            this.ui.modalForm.error.innerHTML += 'Ошибка: прибор в этом здании уже существует';
            this.ui.modalForm.error.classList.remove('d-none');
            return;
        }
        this.ui.modalForm.error.innerHTML += 'Ошибка: ' + message.status + ' | ' + message.statusText
        if (message.data !== undefined) {
            this.ui.modalForm.error.innerHTML += ' | ' + message.data;
        }

        this.ui.modalForm.error.classList.remove('d-none');
    }

    _hideError() {
        this.ui.modalForm.error.innerHTML = '';
        this.ui.modalForm.error.classList.add('d-none');
    }

    hideModal() {
        // let modal = bootstrap.Modal.getInstance(this.ui.modalForm.modal)
        // modal.hide()
        $('#modal__new-entry').modal('hide');//ie11 compatibility
    }


    createModalEquipStateList(data) {
        let selectHtml = '';
        data.forEach(elementState => {
            selectHtml += `<option>` + elementState.state + `</option>`
        });
        document.getElementById('state_tech_condition').innerHTML = selectHtml;
    }

    setModalWorkersFormHtml() {
        this.ui.modalForm.caption.innerHTML = 'Добавить работника';
        this.ui.modalForm.modalBody.innerHTML = this.modalHtml.modalNewWorker;
        this.ui.modalForm.requestUrl = config.api.postPutDeleteWorkers;
    }


    setModalCpsBuildingsFormHtmlListsListeners() {
        this.ui.modalForm.listsArea = document.getElementById('area');
        this.ui.modalForm.group_1 = document.getElementById('group_1');
        this.ui.modalForm.group_2 = document.getElementById('group_2');
        this.ui.modalForm.group_1.disabled = true;
        this.ui.modalForm.group_2.disabled = true;
        let listsAreaSelectedValue = '';
        let listsGroup_1SelectedValue = '';

        this.ui.modalForm.listsArea.addEventListener("change", (event) => {
            this.ui.modalForm.group_2.required = true;
            this.ui.modalForm.group_1.disabled = false;
            this.ui.modalForm.group_2.disabled = true;
            listsAreaSelectedValue = this.ui.modalForm.listsArea.value;
            this.removeOptions(this.ui.modalForm.group_1);
            this.ui.modalForm.group_1.add(new Option('', ''));
            lists.buildings.group_1.forEach((elem) => {
                if (elem.area === listsAreaSelectedValue) {
                    this.ui.modalForm.group_1.add(new Option(elem.group_1, elem.group_1));
                }
            });
        });

        this.ui.modalForm.group_1.addEventListener("change", () => {
            this.ui.modalForm.group_2.required = true;
            this.ui.modalForm.group_2.disabled = false;
            listsGroup_1SelectedValue = this.ui.modalForm.group_1.value;
            this.removeOptions(this.ui.modalForm.group_2);
            this.ui.modalForm.group_2.add(new Option('', ''));
            let group2Count = 0;
            lists.buildings.group_2.forEach((elem) => {
                if (elem.area === listsAreaSelectedValue && elem.group_1 === listsGroup_1SelectedValue) {
                    this.ui.modalForm.group_2.add(new Option(elem.group_2, elem.group_2));
                    group2Count++;
                }
            });
            if (group2Count === 0) {
                this.ui.modalForm.group_2.required = false;
            }
        });
    }

    removeOptions(selectElement) {
        let i, L = selectElement.options.length - 1;
        for (i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }

    setModalCpsBuildingsFormHtml() {
        this.ui.modalForm.caption.innerHTML = 'Добавить здание';
        this.ui.modalForm.modalBody.innerHTML = this.modalHtml.modalNewBuilding;
        this.setModalCpsBuildingsFormHtmlListsListeners();
        this.ui.modalFormPurpose = 'buildings';
        this.ui.modalForm.requestMethod = "POST"
        this.ui.modalForm.requestUrl = config.api.postPutDeleteBuildings;
    }

    setModalCopyEquipmentToBuildingFormHtml() {
        let selectedRow = this.tableAgGrid.getSelectedRow();
        this.agBuildingId = selectedRow.id;
        this.agBuildingName = selectedRow.shed;

        this.ui.modalForm.caption.innerHTML = 'Копировать оборудование ' + this.agBuildingName + ' в здание:';
        this.ui.modalForm.modalBody.innerHTML = this.modalHtml.modalCopyEquipmentFromBuilding;
        this.setModalAgGridBuildings();

        this.ui.modalForm.requestMethod = "POST"
        this.ui.modalFormPurpose = 'copyEquipFromBuilding';
        this.ui.modalForm.requestUrl = config.api.postCopyEquipmentFromFromOneBuildingToAnother;
    }

    setModalCpsEquipmentFormHtml() {
        this.ui.modalForm.caption.innerHTML = 'Добавить оборудование';
        this.ui.modalForm.modalBody.innerHTML = this.modalHtml.modalNewEquipment;
        this.setModalAgGridEquipmentWithFilter();
        this.ui.modalFormPurpose = 'newEquipment';
        this.ui.modalForm.requestMethod = "POST";
        this.ui.modalForm.requestUrl = config.api.postPutDeleteEquipment;
    }

    setModalNewEquipmentInBuildingHtml() {
        this.ui.modalForm.caption.innerHTML = 'Добавить оборудование в ' + this.agBuildingName;
        this.ui.modalForm.modalBody.innerHTML = this.modalHtml.modalNewEquipmentInBuilding;
        document.querySelector('#quantity').addEventListener('input', this.validateNumberWithDot);
        this.setModalAgGridEquipmentWithFilter();
        this.ui.modalForm.requestMethod = "POST";
        this.ui.modalFormPurpose = 'addEquipmentInBuilding';
        this.ui.modalForm.requestUrl = config.api.getPutDeleteEquipmentInBuilding;
    }

    setModalPutEquipmentInBuildingHtml() {
        let selectedRow = this.tableAgGrid.getSelectedRow();
        let equipmentName = selectedRow.equip_name;
        this.ui.modalForm.caption.innerHTML = 'Заменить ' + equipmentName + ' в ' + this.agBuildingName + ' на';
        this.ui.modalForm.modalBody.innerHTML = this.modalHtml.modalPutEquipmentInBuilding;
        this.setModalAgGridEquipmentWithFilter();
        this.ui.modalForm.requestMethod = "PUT";
        this.ui.modalFormPurpose = 'editEquipmentInBuilding';
        this.ui.modalForm.requestUrl = config.api.getPutDeleteEquipmentInBuilding;
    }

    setModalAgGridBuildings() {
        // let cashedAgGridEquip = undefined;
        // if (userRole !== "super-user") {
        //     cashedAgGridEquip = lists.equipment.all
        // }
        this.modalTableAgGrid = new ModalAggrid(agGridParameters.uneditableCopyEquipToBuildingParameters.gridOptions,
            config.api.getBuildingsALl, agGridParameters.uneditableCopyEquipToBuildingParameters.agName, undefined);
        // this.modalTableAgGrid.textBoxFilter = document.querySelector('#aggrid_search');
        // this.modalTableAgGrid.setFilterTextBox();
        // this.modalTableAgGrid.resetFilter();
    }

    setModalAgGridEquipmentWithFilter() {
        let cashedAgGridEquip = undefined;
        if (userRole !== "super-user") {
            cashedAgGridEquip = lists.equipment.all
        }
        this.modalTableAgGrid = new ModalAggrid(agGridParameters.equipmentForChooseParameters.gridOptions,
            config.api.getEquipmentALl, agGridParameters.equipmentForChooseParameters.agName, cashedAgGridEquip);
        this.modalTableAgGrid.textBoxFilter = document.querySelector('#aggrid_search');
        this.modalTableAgGrid.setFilterTextBox();
        this.modalTableAgGrid.resetFilter();
    }

    validateNumberWithDot(e) {
        let text = e.target.value;
        let regText = text.match(/^[0-9]+\.?[0-9]*$/);
        if (regText === null) {
            e.target.value = text.slice(0, -1);
        } else {
            e.target.value = regText[0];
        }
    }

    makeOptionsFromArray(arr) {
        let options;
        options = options + '<option value=""></option>';
        arr.forEach((elem) => {
            options = options + '<option value="' + elem + '">' + elem + '</option>';
        });
        return options;
    }

    initiateModalHtml() {
        this.modalHtml.modalNewEquipmentInBuilding = `
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="aggrid_search" class="col-form-label">Поиск</label>
                            </div>
                            <div class="col-9">
                                 <input type="text"  id="aggrid_search" class="form-control" name="aggrid_search">
                            </div>
                        </div>
                        <div class="modal-aggrid-wrapper">
                            <div id="modal-aggrid" style="width: 100%; height: 100%;"></div>
                        </div>
                        <div class="d-flex justify-content-around">
                            <div class="p-2">
                                <label for="quantity" class="col-form-label">Количество</label>
                            </div>
                            <div class="p-2">
                                 <input type="text" class="form-control" id="quantity" required name="quantity">
                            </div>
                            <div class="p-2">
                                <label for="measure" class="col-form-label">Мера</label>
                            </div>
                            <div class="p-2">
                                 <select class="form-control" id="measure" required name="measure">
                                    <option value="шт.">шт.</option>
                                    <option value="км.">км.</option>
                                 </select>
                            </div>
                        </div>
                        `;

        this.modalHtml.modalPutEquipmentInBuilding = `
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="aggrid_search" class="col-form-label">Поиск</label>
                            </div>
                            <div class="col-9">
                                 <input type="text"  id="aggrid_search" class="form-control" name="aggrid_search">
                            </div>
                        </div>
                        <div class="modal-aggrid-wrapper">
                            <div id="modal-aggrid" style="width: 100%; height: 100%;"></div>
                        </div>`;
        this.modalHtml.modalCopyEquipmentFromBuilding = `
                        <div class="modal-aggrid-wrapper">
                            <div id="modal-aggrid" style="width: 100%; height: 100%;"></div>
                        </div>`;
        this.modalHtml.modalNewWorker = `
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="fio" class="col-form-label">Ф.И.О.</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="fio" required name="fio">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="tab_nom" class="col-form-label">Тебельный N</label>
                            </div>
                            <div class="col-9">
                                <input type="text" class="form-control" id="tab_nom" required name="tab_nom" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="worker_position" class="col-form-label">Должность</label>
                            </div>
                            <div class="col-9">
                                <input type="text" class="form-control" id="worker_position" name="worker_position">
                            </div>
                        </div>`;
        this.modalHtml.modalNewBuilding = `
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="area" class="col-form-label">Участок</label>
                            </div>
                            <div class="col-9">
                              <select class="form-control" id="area" required name="area"">` + this.makeOptionsFromArray(lists.buildings.area) +
            `
                              </select>
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="group_1" class="col-form-label">Группа</label>
                            </div>
                            <div class="col-9">
                                 <select class="form-control" id="group_1" required name="group_1">
                                 </select>
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="group_2" class="col-form-label">Подгруппа</label>
                            </div>
                            <div class="col-9">
                                 <select class="form-control" id="group_2" required name="group_2">
                                 </select>
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="shed" class="col-form-label">Здание</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="shed" required name="shed">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="queue" class="col-form-label">Очередь</label>
                            </div>
                            <div class="col-9">
                                  <select class="form-control" id="queue"  name="queue"">` + this.makeOptionsFromArray(lists.buildings.queue) +
            `
                              </select>
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="affiliate" class="col-form-label">Филиал</label>
                            </div>
                            <div class="col-9">
                                 <select class="form-control" id="affiliate" required name="affiliate">` + this.makeOptionsFromArray(lists.buildings.affiliate) +
            `
                                 </select>
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="proj" class="col-form-label">Проект</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="proj" required name="proj">
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="proj_year" class="col-form-label">Проект год </label>
                            </div>
                            <div class="col-9">
                                 <input type="number" class="form-control" id="proj_year" required name="proj_year">
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="fitt" class="col-form-label">Монтаж</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="fitt" required name="fitt">
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="fitt_year" class="col-form-label">Монтаж год</label>
                            </div>
                            <div class="col-9">
                                 <input type="number" class="form-control" id="fitt_year" required name="fitt_year">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="type_aups" class="col-form-label">ТипАУПС</label>
                            </div>
                            <div class="col-9">
                               <select class="form-control" id="type_aups" required name="type_aups"">` + this.makeOptionsFromArray(lists.buildings.type_aups) +
            `
                              </select>
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="aud_warn_type" class="col-form-label">типСОУЭ</label>
                            </div>
                            <div class="col-9">
                                  <select class="form-control" id="aud_warn_type" required name="aud_warn_type"">` + this.makeOptionsFromArray(lists.buildings.aud_warn_type) +
            `
                              </select>
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="categ_asu" class="col-form-label">Категоря сложности АСУ</label>
                            </div>
                            <div class="col-9">
                                  <select class="form-control" id="categ_asu" required name="categ_asu"">` + this.makeOptionsFromArray(lists.buildings.categ_asu) +
            `
                              </select>
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="plan_graf_name" class="col-form-label">ПланГрафик</label>
                            </div>
                            <div class="col-9">
                                  <select class="form-control" id="plan_graf_name" required name="plan_graf_name"">` + this.makeOptionsFromArray(lists.buildings.planGraf) +
            `
                              </select>
                            </div>
                        </div>
                        `;
        this.modalHtml.modalNewEquipment = `
                        <div class="col-9">
                             <div>Выберите наиболее похожий прибор из существующих:</div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="aggrid_search" class="col-form-label">Поиск</label>
                            </div>
                            <div class="col-9">
                                 <input type="text"  id="aggrid_search" class="form-control"  name="aggrid_search">
                            </div>
                        </div>
                        </div>
                        <div class="modal-aggrid-wrapper">
                            <div id="modal-aggrid" style="width: 100%; height: 100%;"></div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="equip_name" class="col-form-label">Название нового прибора</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="equip_name" required name="equip_name">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="brand_name" class="col-form-label">Производитель</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="brand_name" required name="brand_name">
                            </div>
                        </div>
                        `;
    }
}

