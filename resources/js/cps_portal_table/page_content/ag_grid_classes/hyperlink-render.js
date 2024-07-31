export default class HyperlinkRender {
    init(params) {
        this.params = params;
        this.eGui = document.createElement('a');
        this.eGui.setAttribute("href", params.value);
        this.eGui.innerHTML = params.value;
    }
    getGui() {
        return this.eGui;
    }

}
