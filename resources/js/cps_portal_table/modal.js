import {config} from './cps-portal-dao.js'
import {httpRequest} from './cps-portal-dao.js'
import {addCSRF} from './helper.js'
import ModalAggrid from "./modal-aggrid.js";
import {agGridParameters} from "./ag-grid-parameters";
import {lists} from "./lists";

export default class ModalForm {
    actionMenu;
    tableAgGrid;
    agBuildingId;
    agBuildingName;
    modalTableAgGrid;
    modalHtml = {};
    ui = {
        modalForm: {
            caption: document.getElementById('modal__caption'),
            modal: document.getElementById('modal__new-entry'),
            modalBody: document.querySelector('.modal__form__body'),
            form: document.getElementById('form__new-entry'),
            error: document.getElementById('form__error'),
        },
        modalContainer: document.querySelector('.modal-container'),
        showModalButton: document.querySelector('.new-table-row'),
        modalDialog: document.querySelector('.modal-dialog'),
        requestUrl: undefined,
        requestMethod: 'POST',
    };

    constructor() {
        this.initiateModalHtml();
    }

    modalformWithTexboxesCallback = event => {
        let _this = this;
        event.preventDefault();
        let inputValues = _this.getInputsArr();
        httpRequest(_this.ui.modalForm.requestUrl, 'POST', inputValues).then((e) => {
            _this._hideError();
            _this.hideModal();
            event.target.reset();
            _this.tableAgGrid.setGridData();
            _this.actionMenu.hideAllOneRowAction();
        }).catch((e) => {
            _this._hideError();
            _this._showError(e);
        })
    }

    modalformWithGridCallback = event => {
        let _this = this;
        event.preventDefault();
        let selectedRow = _this.modalTableAgGrid.getSelectedRow();
        if (selectedRow === undefined) {
            this._hideError();
            let massage = {}
            massage.status = 'ошибка ввода'
            massage.statusText = 'прибор не выбран'
            this._showError(massage);
            return;
        }
        let equipmentId = selectedRow.id;
        let requestBody = {};
        requestBody.id_equip = equipmentId;
        let requestUrl = _this.ui.modalForm.requestUrl
        if (_this.ui.modalForm.requestMethod === 'POST') {
            requestBody.quantity = document.querySelector('#quantity').value;
            requestBody.measure = document.querySelector('#measure').value;
            requestBody.id_build = _this.agBuildingId;
        }
        if (_this.ui.modalForm.requestMethod === 'PUT') {
            let selectedRowEquipInBuilding = _this.tableAgGrid.getSelectedRow();
            let buildEquipId = selectedRowEquipInBuilding.id;
            requestUrl = requestUrl + '/' + buildEquipId;
        }
        requestBody = addCSRF(requestBody);
        httpRequest(requestUrl, _this.ui.modalForm.requestMethod, requestBody).then((e) => {
            _this._hideError();
            _this.hideModal();
            event.target.reset();
            _this.tableAgGrid.setGridData();
            _this.modalTableAgGrid.resetFilter();
            _this.actionMenu.hideAllOneRowAction();
        }).catch((e) => {
            _this._hideError();
            _this._showError(e);
        })
    }

    deleteAllSubmitModalFormHandler() {
        this.ui.modalForm.form.removeEventListener('submit', this.modalformWithTexboxesCallback);
        this.ui.modalForm.form.removeEventListener('submit', this.modalformWithGridCallback);
    }

    setFormWithTexboxesSubmitHandler() {
        this.deleteAllSubmitModalFormHandler();
        this.ui.modalForm.form.addEventListener('submit', this.modalformWithTexboxesCallback);
    }

    setFormWithGridSubmitHandler() {
        this.deleteAllSubmitModalFormHandler();
        this.ui.modalForm.form.addEventListener('submit', this.modalformWithGridCallback);
    }

    _showError(message) {
        if (message.status === 409) {
            this.ui.modalForm.error.innerHTML += 'Ошибка: прибор в этом здании уже существует';
            this.ui.modalForm.error.classList.remove('d-none');
            return;
        }
        this.ui.modalForm.error.innerHTML += 'Ошибка: ' + message.status + ' | ' + message.statusText + ' | ' + message.data;
        this.ui.modalForm.error.classList.remove('d-none');
    }

    _hideError() {
        this.ui.modalForm.error.innerHTML = '';
        this.ui.modalForm.error.classList.add('d-none');
    }

    getInputsArr() {
        let data = {};
        let formData = $('#form__new-entry').serializeArray();

        formData.forEach(function (arrayItem) {
            if (arrayItem.value !== '') {
                data[arrayItem.name] = arrayItem.value;
            }
        });
        // if (this.agOuterId !== undefined && (this.tableAgGrid.agName === "innerEquip" ||
        //     this.tableAgGrid.agName === "kapRemont" || this.tableAgGrid.agName === "tehnObslRemont" ||
        //     this.tableAgGrid.agName === "penRen" || this.tableAgGrid.agName === "tro")) {
        //     data['outer_id'] = this.agOuterId;
        // }
        data = addCSRF(data);
        return data;
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

    setModalCpsBuildingsFormHtml() {
        // this.deleteAllSubmitModalFormHandler();
        this.ui.modalForm.caption.innerHTML = 'Добавить здание';
        // modalHtml.modalNewBuilding = modalHtml.modalNewBuilding.replace('@group_1',lists.buildings.group_1);
        // modalHtml.modalNewBuilding = modalHtml.modalNewBuilding.replace('@group_2',lists.buildings.group_2);
        this.ui.modalForm.modalBody.innerHTML = this.modalHtml.modalNewBuilding;
        this.ui.modalForm.requestUrl = config.api.postPutDeleteBuildings;
    }

    setModalCpsEquipmentFormHtml() {
        // this.deleteAllSubmitModalFormHandler();
        this.ui.modalForm.caption.innerHTML = 'Добавить оборудование';
        this.ui.modalForm.modalBody.innerHTML = this.modalHtml.modalNewEquipment;
        this.ui.modalForm.requestUrl = config.api.postPutDeleteEquipment;
    }

    setModalNewEquipmentInBuildingHtml() {
        this.ui.modalForm.caption.innerHTML = 'Добавить оборудование в ' + this.agBuildingName;
        this.ui.modalForm.modalBody.innerHTML = this.modalHtml.modalNewEquipmentInBuilding;
        document.querySelector('#quantity').addEventListener('input', this.validateNumberWithDot);
        this.modalTableAgGrid = new ModalAggrid(agGridParameters.equipmentForChooseParameters.gridOptions,
            config.api.getEquipmentALl, agGridParameters.equipmentForChooseParameters.agName);
        this.modalTableAgGrid.textBoxFilter = document.querySelector('#equip_search');
        this.modalTableAgGrid.setFilterTextBox();
        this.ui.modalForm.requestMethod = "POST";
        this.setFormWithGridSubmitHandler();
        this.ui.modalForm.requestUrl = config.api.getPutDeleteEquipmentInBuilding;
    }

    setModalPutEquipmentInBuildingHtml() {
        let selectedRow = this.tableAgGrid.getSelectedRow();
        let equipmentName = selectedRow.equip_name;
        this.ui.modalForm.caption.innerHTML = 'Заменить ' + equipmentName + ' в ' + this.agBuildingName + ' на';
        this.ui.modalForm.modalBody.innerHTML = this.modalHtml.modalPutEquipmentInBuilding;
        this.modalTableAgGrid = new ModalAggrid(agGridParameters.equipmentForChooseParameters.gridOptions,
            config.api.getEquipmentALl, agGridParameters.equipmentForChooseParameters.agName);
        this.modalTableAgGrid.textBoxFilter = document.querySelector('#equip_search');
        this.modalTableAgGrid.setFilterTextBox();
        this.ui.modalForm.requestMethod = "PUT";
        this.setFormWithGridSubmitHandler();
        this.ui.modalForm.requestUrl = config.api.getPutDeleteEquipmentInBuilding;
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
    initiateModalHtml(){
        this.modalHtml.modalNewEquipmentInBuilding = `
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="equip_search" class="col-form-label">Поиск</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="equip_search"  name="equip_search">
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
                                <label for="equip_search" class="col-form-label">Поиск</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="equip_search"  name="equip_search">
                            </div>
                        </div>
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
                              <select class="form-control" id="area" required name="area"">` + lists.buildings.area +
                              `
                              </select>
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="group_1" class="col-form-label">Группа</label>
                            </div>
                            <div class="col-9">
                                 <select class="form-control" id="group_1" required name="group_1">` + lists.buildings.group_1 +
                                 `
                                 </select>
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="group_2" class="col-form-label">Подгруппа</label>
                            </div>
                            <div class="col-9">
                                 <select class="form-control" id="group_2"  name="group_2">` + lists.buildings.group_2 +
                                 `
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
                                <label for="Queue" class="col-form-label">Очередь</label>
                            </div>
                            <div class="col-9">
                                  <select class="form-control" id="queue"  name="queue"">` + lists.buildings.queue +
                              `
                              </select>
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="affiliate" class="col-form-label">Филиал</label>
                            </div>
                            <div class="col-9">
                                 <select class="form-control" id="affiliate" required name="affiliate">` + lists.buildings.affiliate +
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
                               <select class="form-control" id="type_aups" required name="type_aups"">` + lists.buildings.type_aups +
                              `
                              </select>
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="aud_warn_type" class="col-form-label">типСОУЭ</label>
                            </div>
                            <div class="col-9">
                                  <select class="form-control" id="aud_warn_type" required name="aud_warn_type"">` + lists.buildings.aud_warn_type +
                              `
                              </select>
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="categ_asu" class="col-form-label">Категоря сложности АСУ</label>
                            </div>
                            <div class="col-9">
                                  <select class="form-control" id="categ_asu" required name="categ_asu"">` + lists.buildings.categ_asu +
                              `
                              </select>
                            </div>
                        </div>
                        `;
        this.modalHtml.modalNewEquipment = `
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="equip_name" class="col-form-label">Название</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="equip_name" required name="equip_name">
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="kind_app" class="col-form-label">ТипОбобщенный</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="kind_app" required name="kind_app">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="kind_app_second" class="col-form-label">Тип</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="kind_app_second" required name="kind_app_second">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="kind_signal" class="col-form-label">ТипСигнала</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="kind_signal" required name="kind_signal">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="brand_name" class="col-form-label">Производитель</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="brand_name" required name="brand_name">
                            </div>
                        </div>`;
    }
}

