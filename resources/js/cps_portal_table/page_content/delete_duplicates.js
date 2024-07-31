import TableAgGrid from "./aggrid";
import {agGridParameters} from "./ag-grid-parameters";
import {config, httpRequest} from "../cps-portal-dao";
import {addCSRF} from "../helper";

export function createDeleteDuplicatesForm(idDiv) {
    let duplicatesDelMenu = document.createElement('div');
    duplicatesDelMenu.setAttribute("id", "duplicate-menu");
    duplicatesDelMenu.setAttribute('style', 'display:flex; flex-direction: column; height: 100%;');
    duplicatesDelMenu.innerHTML = `
                <div class='duplicate_menu_upper_part'>
                     <div class="row p-2">
                            <div class="col-1">
                                <label for="equip_remain" class="col-form-label">Остается</label>
                            </div>
                            <div class="col-1">
                                 <input type="text" class="form-control" id="equip_remain_id"  name="equip_remain_id" readonly>

                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="equip_remain"  name="equip_remain" readonly>

                            </div>
                     </div>

                     <div class="row p-2">
                            <div class="col-1">
                                <label for="equip_to_del" class="col-form-label">Удаляется</label>
                            </div>
                            <div class="col-1">
                                 <input type="text" class="form-control" id="equip_to_del_id"  name="equip_to_del_id" readonly>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="equip_to_del"  name="equip_to_del" readonly>
                            </div>
                     </div>
                </div>
                <div class="row p-2">
                    <div class="col-sm">
                        <button type="button" class="btn btn-primary " id="btn_equip_remain">Оставить</button>
                    </div>
                    <div class="col-sm">
                        <button type="button" class="btn btn-success" id="btn_equip_to_del">Удалить</button>
                    </div>
                    <div class="col-sm-8">
                        <div class="row justify-content-center">
                            <button type="button" class="btn btn-danger" id="btn_del_equip_duplicate">Выполнить</button>
                        </div>
                    </div>
                </div>
                <div class='duplicate_menu_bottom_part' style="display:flex; height: 100%;">
                    <div id="duplicate_menu_bottom_part__left_agGrid" ">
                    </div>
                    <div id="duplicate_menu_bottom_part__right_agGrid" ">
                    </div>
                </div>
        `

    idDiv.prepend(duplicatesDelMenu);
    let tableAgGridRemain = new TableAgGrid(agGridParameters.uneditableEquipmentParameters.gridOptions,
        config.api.getEquipmentALl, config.api.postPutDeleteEquipment,
        agGridParameters.equipmentParameters.agName, this.actionMenu, undefined,
        undefined, undefined, "duplicate_menu_bottom_part__left_agGrid");
    let tableAgGridToDel = new TableAgGrid(agGridParameters.uneditableEquipmentParameters2.gridOptions,
        config.api.getEquipmentALl, config.api.postPutDeleteEquipment,
        agGridParameters.equipmentParameters.agName, this.actionMenu, undefined,
        undefined, undefined, 'duplicate_menu_bottom_part__right_agGrid');
    document.querySelector('#btn_equip_remain').onclick = () => {
        let selectedRow = tableAgGridRemain.getSelectedRow();
        if (selectedRow !== undefined) {
            document.querySelector('#equip_remain_id').value = selectedRow.id;
            document.querySelector('#equip_remain').value = selectedRow.equip_name;
        }

    }
    document.querySelector('#btn_equip_to_del').onclick = () => {
        let selectedRow = tableAgGridToDel.getSelectedRow();
        if (selectedRow !== undefined) {
            document.querySelector('#equip_to_del_id').value = selectedRow.id;
            document.querySelector('#equip_to_del').value = selectedRow.equip_name;
        }

    }
    document.querySelector('#btn_del_equip_duplicate').onclick = () => {
        let idEquipToDel = document.querySelector('#equip_to_del_id').value;
        let idEquipRemain = document.querySelector('#equip_remain_id').value;
        if (idEquipToDel === '' || idEquipRemain === '') {
            throw ('empty idEquipToDel or idEquipRemain')
        }
        if (idEquipToDel === idEquipRemain) {
            throw ('idEquipToDel is equal to idEquipRemain')
        }
        let requestData = {};
        requestData.id_equip_to_del = idEquipToDel;
        requestData.id_equip_remain = idEquipRemain;
        requestData = addCSRF(requestData);
        httpRequest(config.api.postDeleteEquipDuplicates, 'POST', requestData).then((e) => {

        }).catch((e) => {
            console.log(e);
        });
    }
}
