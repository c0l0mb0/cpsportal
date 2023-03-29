export default class NotEditableCheckboxRenderer {
    init(params) {
        this.params = params;

        this.eGui = document.createElement('input');
        this.eGui.type = 'checkbox';
        this.eGui.setAttribute("onclick", "return false");
        this.eGui.checked = params.value;
    }
    getGui() {
        return this.eGui;
    }

}
