import {config, downloadFile, httpRequest} from "../cps-portal-dao";
import {lists} from "../lists";
import {addCSRF} from "../helper";

export default class ActInvestigation {
    idPageContent;
    actOptionsHtml;
    usageHours;

    constructor(idPageContent) {
        this.idPageContent = idPageContent;
        this.assignHtml();
        this.idPageContent.innerHTML = this.actOptionsHtml;
        this.assignBuildingFilters();
        this.assignFaultsFilters();
        this.assignElementsFilters();
        this.assignOccupations();
        document.querySelector('.act-investigate-form').addEventListener("submit", (event) => {
            event.preventDefault();
            try {
                let requestData = {};
                const formDataArray = Array.from(document.querySelector('.act-investigate-form').getElementsByClassName('form-control'));
                formDataArray.forEach((element) => {
                    requestData[element.name] = element.value;
                });
                requestData.usage_hours = this.usageHours;
                requestData = addCSRF(requestData);
                downloadFile(config.api.postExportActInvestigation, 'POST', requestData)
            } catch (e) {
                console.log(e);
            }
        });
    }

    assignOccupations() {
        const occupation1 = document.querySelector('#act-investigate-commission-memb-1-occupation');
        const occupation2 = document.querySelector('#act-investigate-commission-memb-2-occupation');
        const occupation3 = document.querySelector('#act-investigate-commission-memb-3-occupation');
        let arrOccup = [occupation1, occupation2, occupation3,];
        arrOccup.forEach((occupDiv) => {
            occupDiv.innerHTML = `
        <option value="слесарь КИПиА, ф.УАиМО ЦПС на ГП" selected>слесарь КИПиА, ф.УАиМО ЦПС на ГП</option>
        <option value="электромантер ОПС, ф.УАиМО ЦПС на ГП">электромантер ОПС, ф.УАиМО ЦПС на ГП</option>
        <option value="инженер-электроник,  ф.УАиМО ЦПС на ГП">инженер-электроник, ф.УАиМО ЦПС на ГП</option>
        <option value="инженер КИПиА, ф.ГПУ">инженер КИПиА, ф.ГПУ</option>
        <option value="инженер КИПиА, ф.ГПУ">инженер по ЭОГО, ф.ГПУ</option>
        <option value=" ">заполнить позже</option>`
        })


    }

    assignElementsFilters() {
        let elementsGroup = document.getElementById('act-investigate-element-code-group');
        let elementType = document.getElementById('act-investigate-element-code');

        elementsGroup.addEventListener("change", (event) => {
            this.removeOptions(elementType);
            elementType.add(new Option('', ''));
            lists.faultElementGroup.forEach((faultElementGroup) => {
                if (faultElementGroup.name === elementsGroup.value) {
                    faultElementGroup.elementTypes.forEach((elem) => {
                        elementType.add(new Option(elem, elem));
                    });
                }
            });
            elementType.disabled = false;
            elementType.required = true;
        });
    }

    assignFaultsFilters() {
        let faultReasonsGroup = document.getElementById('act-investigate-fault-reason-group');
        let faultReason = document.getElementById('act-investigate-fault-reason');

        faultReasonsGroup.addEventListener("change", (event) => {

            this.removeOptions(faultReason);
            faultReason.add(new Option('', ''));
            lists.faultReasonGroup.forEach((faultReasonGroup) => {
                if (faultReasonGroup.name === faultReasonsGroup.value) {
                    faultReasonGroup.faultReasonTypes.forEach((reason) => {
                        faultReason.add(new Option(reason, reason));
                    });
                }
            });
            faultReason.disabled = false;
            faultReason.required = true;
        });

        this.setDefaultFaultReasonsGroup(faultReasonsGroup, faultReason);
    }

    setDefaultFaultReasonsGroup(faultReasonsGroup, faultReason) {
        Array.from(faultReasonsGroup.options).forEach(function (option_element) {
            if (option_element.text === '5. Неудовлетворительное техническое состояние')
                option_element.selected = true;
        });
        faultReason.add(new Option('', ''));
        lists.faultReasonGroup.forEach((faultReasonGroupElem) => {
            if (faultReasonGroupElem.name === '5. Неудовлетворительное техническое состояние') {
                faultReasonGroupElem.faultReasonTypes.forEach((reason) => {
                    faultReason.add(new Option(reason, reason));
                });
            }
        });
        faultReason.disabled = false;
        Array.from(faultReason.options).forEach(function (faultReasonElem) {
            if (faultReasonElem.text === '5.9 Исчерпание ресурса')
                faultReasonElem.selected = true;
        });
    }

    assignBuildingFilters() {
        let listsArea = document.getElementById('act-investigate-area');
        let group_1 = document.getElementById('act-investigate-group_1');
        let group_2 = document.getElementById('act-investigate-group_2');
        let shed = document.getElementById('act-investigate-shed');

        group_1.disabled = true;
        group_2.disabled = true;
        shed.disabled = true;


        let listsAreaSelectedValue = '';
        let listsGroup_1SelectedValue = '';
        let listsGroup_2SelectedValue = '';

        listsArea.addEventListener("change", (event) => {
            group_1.disabled = false;
            group_2.disabled = true;
            shed.disabled = true;
            group_2.required = true;

            listsAreaSelectedValue = listsArea.value;
            this.removeOptions(group_1);
            this.removeOptions(group_2);
            this.removeOptions(shed);
            group_1.add(new Option('', ''));
            lists.buildings.group_1.forEach((elem) => {
                if (elem.area === listsAreaSelectedValue) {
                    group_1.add(new Option(elem.group_1, elem.group_1));
                }
            });

        });

        group_1.addEventListener("change", (event) => {
            group_2.disabled = false;
            group_2.required = true;
            shed.disabled = true;

            listsGroup_1SelectedValue = group_1.value;
            let group2Count = 0;
            this.removeOptions(group_2);
            this.removeOptions(shed);

            group_2.add(new Option('', ''));
            lists.buildings.group_2.forEach((elem) => {
                if (elem.area === listsAreaSelectedValue && elem.group_1 === listsGroup_1SelectedValue) {
                    group_2.add(new Option(elem.group_2, elem.group_2));
                    group2Count++;
                }
            });
            if (group2Count === 0) {
                group_2.required = false;
                group_2.disabled = true;
                shed.disabled = false;
                shed.required = true;
                shed.add(new Option('', ''));
                lists.buildings.all.forEach((elem) => {
                    if (elem.area === listsAreaSelectedValue && elem.group_1 === listsGroup_1SelectedValue) {
                        shed.add(new Option(elem.shed, elem.id));
                    }
                });
            }

        });

        group_2.addEventListener("change", (event) => {
            shed.disabled = false;
            shed.required = true;

            listsGroup_2SelectedValue = group_2.value;

            this.removeOptions(shed);
            shed.add(new Option('', ''));
            lists.buildings.all.forEach((elem) => {
                if (elem.area === listsAreaSelectedValue && elem.group_1 === listsGroup_1SelectedValue &&
                    elem.group_2 === listsGroup_2SelectedValue) {
                    shed.add(new Option(elem.shed, elem.id));
                }
            });
        });

        shed.addEventListener("change", (event) => {
            let calculatedUsedHours = document.querySelector('.calculated-used-hours');
            let shedId = parseInt(shed.value);
            lists.buildings.all.forEach((row) => {
                if (row.id === shedId) {
                    const fittYear = parseInt(row.fitt_year);
                    const todayDate = new Date();
                    const todayYear = todayDate.getFullYear();
                    const usageYears = todayYear - fittYear;
                    this.usageHours = 8760 * usageYears;
                    calculatedUsedHours.textContent = 'Наработка отказавшего элемента = (тек.год - монтажздания год ) * 8760 = ' + '(' +
                        todayYear + ' - ' + fittYear + ') * 8760 = ' + this.usageHours + ' часов';
                }
            });
        });

    }

    removeOptions(selectElement) {
        let i, L = selectElement.options.length - 1;
        for (i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }

    assignHtml() {
        let faultReasonGroup = '';
        faultReasonGroup += '<option value=""></option>'
        lists.faultReasonGroup.forEach((elem) => {
            faultReasonGroup += '<option value="' + elem.name + '">' + elem.name + '</option>'
        })
        let faultElementGroup = '';
        faultElementGroup += '<option value=""></option>'
        lists.faultElementGroup.forEach((elem) => {
            faultElementGroup += '<option value="' + elem.name + '">' + elem.name + '</option>'
        })
        this.actOptionsHtml = `
        <form  class="act-investigate-form col-md-8 mt-5" style="max-width: 900px;margin-left: 80px;">
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-approve_fio" class="col-form-label">Кто утвердит (Деревянных в первую
                        очередь)</label>
                </div>
                <div class="col-9">
                    <select class="form-control" id="act-investigate-approve_fio" required name="act_investigate_approve_fio">
                        <option value="О.Л. Деревянных" selected>О.Л. Деревянных</option>
                        <option value="А.А. Турбин">А.А. Турбин</option>
                        <option value="С.И. Гункин">С.И. Гункин</option>
                    </select>
                </div>
            </div>
            <div class="separated-line row"></div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-area" class="col-form-label">Участок</label>
                </div>
                <div class="col-9">
                    <select class="form-control" id="act-investigate-area" required name="act_investigate_area">
                        <option value="" selected></option>
                        <option value="ГП">ГП</option>
                        <option value="Ямбург">Ямбург</option>
                        <option value="Новый Уренгой">Новый Уренгой</option>
                    </select>
                </div>
            </div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-group_1" class="col-form-label">Группа</label>
                </div>
                <div class="col-9">
                    <select class="form-control" id="act-investigate-group_1" required disabled name="act_investigate_group_1">
                    </select>
                </div>
            </div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-group_2" class="col-form-label">Подгруппа</label>
                </div>
                <div class="col-9">
                    <select class="form-control" id="act-investigate-group_2" required disabled name="act_investigate_group_2">
                    </select>
                </div>
            </div>
            <div class="row p-2 act-investigate-shed-wrapper">
                  <div class="col-3">
                    <label for="act-investigate-shed" class="col-form-label">Здание</label>
                  </div>
                    <div class="col-9">
                        <select class="form-control" id="act-investigate-shed" required disabled name="act_investigate_shed">
                        </select>
                    </div>
            </div>
            <div class="calculated-used-hours-wrapper m-2">
                <label class="calculated-used-hours col-form-label"></label>
            </div>
            <div class="separated-line row"></div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-date-issue" class="col-form-label" >Дата составления акта</label>
                </div>
                <div class="col-9">
                    <input type="date" class="form-control" id="act-investigate-date-issue" name="act_investigate_date_issue"
                           min="2023-01-01" required> </input>
                </div>
            </div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-date" class="col-form-label" >Дата отказа</label>
                </div>
                <div class="col-9">
                    <input type="date" class="form-control" id="act-investigate-date" name="act_investigate_date"
                           min="2023-01-01" required> </input>
                </div>
            </div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-time" class="col-form-label">Время отказа</label>
                </div>
                <div class="col-9">
                    <input type="time" class="form-control" id="act-investigate-time" name="act_investigate_time" required></input>
                </div>
            </div>
            <div class="separated-line row"></div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-external-signs" class="col-form-label">Указать текст сообщения в журнале событий АРМ, либо видимую неисправность оборудования</label>
                </div>
                <div class="col-9">
                    <textarea class="form-control" id="act-investigate-external-signs" name="act_investigate_external_signs" required></textarea>
                </div>
            </div>
            <div class="separated-line row"></div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-short-description" class="col-form-label">Краткое описание неисправности</label>
                </div>
                <div class="col-9">
                    <textarea class="form-control" id="act-investigate-short-description" name="act_investigate_short_description" required></textarea>
                </div>
            </div>
            <div class="separated-line row"></div>
            <div class="act-investigate-full-description-hint m-2">
                <label for="act-investigate-full-description" class="col-form-label">Подробное описание выполненных мероприятий по обнаружению причины отказа оборудования. Указать: заводской (серийный) номер неисправного устройства и его позиционное обозначение; какой ЗИП (ОС, заказчика, подрядчика) был использован при замене. Если неисправность СПА ГПА, то указать в каком режиме находился агрегат (Ремонт, Резерв, Магистраль)</label>
            </div>
            <div class="col-12 p-2">
                    <textarea class="form-control" id="act-investigate-full-description" name="act_investigate_full_description" required></textarea>
            </div>
            <div class="separated-line row"></div>
            <div class="act-investigate-immediately-actions-hint m-2">
                <label for="act-investigate-immediately-actions" class="col-form-label">Оперативные меры. Указать: отправили для диагностики и ремонта в ЦОиР КТС или выполнили ремонт самостоятельно</label>
            </div>
            <div class="col-12 p-2">
                    <textarea class="form-control" id="act-investigate-immediately-actions" name="act_investigate_immediately_actions" required>....были переданы в ЦОиР КТС для диагностики и ремонта</textarea>
            </div>
            <div class="separated-line row"></div>
            <div class="act-investigate-prevent-actions-hint m-2">
                <label for="act-investigate-prevent-actions" class="col-form-label">Мероприятия по устранению причины и последствий отказа. Указать, если таковые имеются (например ежемесячное тестирование жесткого диска), если нет, то - мероприятия не предусмотрены</label>
            </div>
            <div class="col-12 p-2">
                    <textarea class="form-control" id="act-investigate-prevent-actions" name="act_investigate_prevent_actions" required>Мероприятия не предусмотрены.</textarea>
            </div>
            <div class="separated-line row"></div>
            <div class="row p-2">
                <div class="col-2">
                    <label for="act-investigate-commission-memb-1" class="col-form-label">Коммисся ФИО1</label>
                </div>
                <div class="col-3">
                    <input class="form-control" id="act-investigate-commission-memb-1"
                           name="act_investigate_commission_memb_1" required> </input>
                </div>
                <div class="col-2">
                    <label for="act-investigate-commission-memb-1-occupation" class="col-form-label">Должность</label>
                </div>
                <div class="col-5">
                    <select class="form-control" id="act-investigate-commission-memb-1-occupation" required
                            name="act_investigate_commission_memb_1_occupation">

                    </select>
                </div>
            </div>
            <div class="row p-2">
                <div class="col-2">
                    <label for="act-investigate-commission-memb-2" class="col-form-label">Коммисся ФИО2</label>
                </div>
                <div class="col-3">
                    <input class="form-control" id="act-investigate-commission-memb-2"
                           name="act_investigate_commission_memb_2" required> </input>
                </div>
                <div class="col-2">
                    <label for="act-investigate-commission-memb-2-occupation" class="col-form-label">Должность</label>
                </div>
                <div class="col-5">
                    <select class="form-control" id="act-investigate-commission-memb-2-occupation" required
                            name="act_investigate_commission_memb_2_occupation">
                    </select>
                </div>
            </div>
            <div class="row p-2">
                <div class="col-2">
                    <label for="act-investigate-commission-memb-3" class="col-form-label">Коммисся ФИО3</label>
                </div>
                <div class="col-3">
                    <input class="form-control" id="act-investigate-commission-memb-3"
                           name="act_investigate_commission_memb_3" required> </input>
                </div>
                <div class="col-2">
                    <label for="act-investigate-commission-memb-3-occupation" class="col-form-label">Должность</label>
                </div>
                <div class="col-5">
                    <select class="form-control" id="act-investigate-commission-memb-3-occupation" required
                            name="act_investigate_commission_memb_3_occupation">
                    </select>
                </div>
            </div>
            <div class="separated-line row"></div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-fault-reason-tu" class="col-form-label">Причина отказа ТУ</label>
                </div>
                <div class="col-9">
                    <select class="form-control" id="act-investigate-fault-reason-tu" required name="act_investigate_fault_reason_tu">
                        <option value="R2.1" selected>R2.1 (все что в поле, что в агрегатах, уптиг итд.)</option>
                        <option value="R4.2.1">R4.2.1 (все что находится в операторной - АРМ и его части, УПИ)</option>
                    </select>
                </div>
            </div>
            <div class="separated-line row"></div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-fault-reason-group" class="col-form-label">Группа причины отказа</label>
                </div>
                <div class="col-9">
                    <select class="form-control" id="act-investigate-fault-reason-group" required name="act_investigate_fault_reason_group">
                       ` + faultReasonGroup + `
                    </select>
                </div>
            </div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-fault-reason" class="col-form-label">Причина отказа</label>
                </div>
                <div class="col-9">
                    <select class="form-control" id="act-investigate-fault-reason" required disabled name="act_investigate_fault_reason">
                    </select>
                </div>
            </div>
            <div class="separated-line row"></div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-element-code-group" class="col-form-label">Группа элементов</label>
                </div>
                <div class="col-9">
                    <select class="form-control" id="act-investigate-element-code-group"
                    required name="act_investigate_element_code_group">`
            + faultElementGroup + `
                    </select>
                </div>
            </div>
            <div class="row p-2">
                <div class="col-3">
                    <label for="act-investigate-element-code" class="col-form-label">Код отказавшего элемента</label>
                </div>
                <div class="col-9">
                    <select class="form-control" id="act-investigate-element-code" required
                     disabled name="act_investigate_element_code">
                    </select>
                </div>
            </div>
            <div class="d-flex flex-row-reverse bd-highlight last-div">
                        <button type="submit" class="btn btn-primary btn-create-act">Создать</button>
            </div>
        </form>
        `;
    }


}
