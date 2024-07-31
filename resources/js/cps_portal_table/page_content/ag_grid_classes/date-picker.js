export default class DatePicker {
    init(params) {
        flatpickr.localize(flatpickr.l10ns.ru);
        this.input = document.createElement("input");
        this.input.className = 'input-date-editor';
        this.input.value =  params.value;

        let postgresqlFormat = this.input.value;
        let dateHumanFormat= postgresqlFormat.split('-').reverse().join('.');

        let optional_config = {
            dateFormat: "d.m.Y",
            defaultDate: dateHumanFormat
        }

        this.input.flatpickr(optional_config);
    }

    getGui() {
        return this.input;
    }

    afterGuiAttached() {
        this.input.focus();
        this.input.select();
    }

    getValue() {
        let dateHumanFormat = this.input.value;
        let postgresqlFormat= dateHumanFormat.split('.').reverse().join('-');
        return postgresqlFormat;
    }

    destroy() {
    }

    isPopup() {
        return false;
    }
}
