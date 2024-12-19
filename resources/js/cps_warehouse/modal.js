
export default class ModalForm {
    actionMenu;
    tableAgGrid;
    modalTableAgGrid;
    agBuildingId;
    agBuildingName;
    modalHtml = {};
    putId;
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


    constructor() {
        this.initiateModalHtml();
    }


    initiateModalHtml() {

    }
}

