import {lists} from "../lists";

export function createPlanGrafForm(idPageContent) {
    let menuPlanGraf = document.createElement('duplicate_menu_bottom_part__left_agGrid');
    menuPlanGraf.setAttribute("id", "menuPlanGraf");
    menuPlanGraf.innerHTML = `
                    <div class="d-inline">
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="year_pl_gr" class="col-form-label">Год</label>
                            </div>
                            <div class="col-9">
                                 <input type="number" class="form-control" id="year_pl_gr" required  name="year_pl_gr">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="who_approve_fio" class="col-form-label" >Утвердил</label>
                            </div>
                            <div class="col-9">
                                 <select class="form-control" id="who_approve_fio" required  name="who_approve_fio">
                                 </select>
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-3">
                                <label for="who_assign_fio" class="col-form-label">Составл</label>
                            </div>
                            <div class="col-9">
                                 <select class="form-control" id="who_assign_fio" required name="who_assign_fio">
                                 </select>
                            </div>
                        </div>
                    </div>
            `
    idPageContent.prepend(menuPlanGraf);
    document.querySelector('#year_pl_gr').value = parseInt(new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getFullYear());
    let whoApproveFio = document.querySelector('#who_approve_fio');
    let who_assign_fio = document.querySelector('#who_assign_fio');

    lists.workers.all.forEach((worker) => {
        if (worker.worker_position.includes('цех')) {
            whoApproveFio.add(new Option(worker.fio, worker.tab_nom));
        }
    });
    lists.workers.all.forEach((worker) => {
        if (worker.worker_position.includes('Мастер') || worker.worker_position.includes('участ')) {
            who_assign_fio.add(new Option(worker.fio, worker.tab_nom));
        }
    });
}
