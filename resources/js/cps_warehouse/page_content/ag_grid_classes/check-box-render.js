export default class CheckboxRenderer {
    init(params) {
        this.params = params;
        this.eGui = document.createElement('input');
        this.eGui.type = 'checkbox';
        this.eGui.checked = params.value;


        if (params.colDef.editable !== false) {
            this.checkedHandler = this.checkedHandler.bind(this);
            this.eGui.addEventListener('click', this.checkedHandler);
            // return this.cancelBeforeStart = true;
        } else {
            this.eGui.addEventListener('click', (e)=>{
                e.preventDefault();
            })
        }
    }

    checkedHandler(e) {
        let checked = e.target.checked;
        let colId = this.params.column.colId;
        this.params.node.setDataValue(colId, checked);
    }

    getGui() {
        return this.eGui;
    }

    destroy() {
        this.eGui.removeEventListener('click', this.checkedHandler);
    }

    isCancelBeforeStart() {
        return this.cancelBeforeStart;
    }

}
