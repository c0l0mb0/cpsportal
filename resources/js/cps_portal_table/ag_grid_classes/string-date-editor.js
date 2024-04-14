export default class StringDateEditor {
    // gets called once before the renderer is used
    init(params) {
        // create the cell
        this.eInput = document.createElement('input');
        this.eInput.setAttribute('style', 'whidth:100%;border:0');

        let postgresqlFormat = params.value;
        // console.log(postgresqlFormat)
        const mask = IMask(
            this.eInput,
            {
                mask: Date,
                min: new Date(1990, 0, 1),
                lazy: false
            }
        );

        if (postgresqlFormat !== null && postgresqlFormat !== undefined) {
            let userFormatParts = postgresqlFormat.split('-');
            mask.value = `${userFormatParts[2]}.${userFormatParts[1]}.${userFormatParts[0]}`;
        }

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
    }

    isCancelAfterEnd() {
        if (this.eInput.value === null || this.eInput.value === undefined || this.eInput.value === "" ||
            this.eInput.value.includes('_')) {
            return true;
        }
        return false;
    }

    // returns the new value after editing
    getValue() {

        let userFormatParts = this.eInput.value.split('.');
        return `${userFormatParts[2]}-${userFormatParts[1]}-${userFormatParts[0]}`;
    }

    // any cleanup we need to be done here
    destroy() {
        // but this example is simple, no cleanup, we could  even leave this method out as it's optional
    }
}
