export default class ActionMenu {
    tableAgGrid;
    modalForm;
    newTableRow;
    deleteTableRow;
    deleteAction;
    exportExcel;
    editTableRow;
    addButtonActionEventLister;
    copyEquipToBuildingEventLister;
    returnButtonAction;
    importReminds;


    hideALl() {
        this.newTableRow.style.display = 'none';
        this.deleteTableRow.style.display = 'none';
        this.exportExcel.style.display = 'none';
        this.editTableRow.style.display = 'none';
        this.importReminds.style.display = 'none';
    }

    showImportRemindsButton() {
        this.importReminds.style.display = 'block';
    }

    setImportRemindsAction() {
        this.importReminds.removeEventListener('click', this.importRemindsButtonActionEventLister);
        this.importReminds.addEventListener('click', this.importRemindsButtonActionEventLister);
    }

    importRemindsButtonActionEventLister() {
        console.log('importRemindsButtonActionEventLister');
    }
    setExportExcelAction() {
        this.exportExcel.onclick = () => {
            this.tableAgGrid.exportDisplyedDataToExcel();
        };
    }


}


