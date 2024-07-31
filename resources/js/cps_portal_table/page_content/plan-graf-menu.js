export function createPlanGrafForm (idPageContent) {
    let menuPlanGraf = document.createElement('duplicate_menu_bottom_part__left_agGrid');
    menuPlanGraf.setAttribute("id", "menuPlanGraf");
    menuPlanGraf.innerHTML = `
                    <div class="d-inline">
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="year_pl_gr" class="col-form-label">Год</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="year_pl_gr" required  name="year_pl_gr">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="who_approve_fio" class="col-form-label">Утвердил ФИО</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="who_approve_fio" required  name="who_approve_fio">
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="who_approve_position" class="col-form-label">Утвердил Должность</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="who_approve_position" required  name="who_approve_position">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="who_assign_fio" class="col-form-label">Составл ФИО</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="who_assign_fio"  required name="who_assign_fio">
                            </div>
                        </div>
                         <div class="row p-2">
                            <div class="col-3">
                                <label for="who_assign_position" class="col-form-label">Подписал Должность</label>
                            </div>
                            <div class="col-9">
                                 <input type="text" class="form-control" id="who_assign_position" required text="Зам.нач. цеха" name="who_assign_position">
                            </div>
                        </div>
                    </div>
            `
    idPageContent.prepend(menuPlanGraf);
    document.querySelector('#year_pl_gr').value = "2024";
    document.querySelector('#who_approve_fio').value = "А.Н. Ильин";
    document.querySelector('#who_approve_position').value = "Зам.нач. цеха";
    document.querySelector('#who_assign_fio').value = "Д.С. Коротун";
    document.querySelector('#who_assign_position').value = "Нач.участка";
}
