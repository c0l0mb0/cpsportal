export default class CustomCellEditor {
    // gets called once before the renderer is used
    init(params) {
        // create the cell
        this.eInput = document.createElement('input');
        this.eDiv = document.createElement('div');
        this.eInput.className = 'simple-text-input-editor';

        this.eInput.value = params.value;

        if (params.charPress !== null) {
            this.cancelBeforeStart = true;
        }
    }

    isKeyPressedNumeric(event) {
        const charStr = event.key;
        return this.isCharNumeric(charStr);
    }

    isKeyPressedNavigation(event) {
        return event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    }

    isCharNumeric(charStr) {
        return charStr && !!/\d/.test(charStr);
    }

    // gets called once when grid ready to insert the element
    getGui() {
        return this.eInput;
    }

    // focus and select can be done after the gui is attached
    afterGuiAttached() {
        this.eInput.focus();
    }

    // returns the new value after editing
    isCancelBeforeStart() {
        return this.cancelBeforeStart;
    }


    // returns the new value after editing
    getValue() {
        return this.eInput.value;
    }

    // any cleanup we need to be done here
    destroy() {
        // but this example is simple, no cleanup, we could  even leave this method out as it's optional
    }
}
