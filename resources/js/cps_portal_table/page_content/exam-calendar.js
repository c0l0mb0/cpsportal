import {config, httpRequest} from "../cps-portal-dao";
import {changePageTitle} from "../helper";

export function createExamCalendarForm(idDiv) {
    let events = [];
    httpRequest(config.api.getWorkersALl, 'GET').then((getWorkersData) => {
        let fieldsToCheckRu = {
            "height_next": 'Высота',
            "electrobez_next": 'Электробез',
            "medcheck_next": 'Медосмотр'
        };
        let idEvent = 0;
        getWorkersData.forEach((workerData) => {
            Object.keys(fieldsToCheckRu).forEach(function (key) {
                if (workerData[key] !== null) {
                    let workerCheckCalendarData = {
                        id: undefined,
                        title: undefined,
                        start: undefined,
                    }
                    idEvent = ++idEvent;
                    workerCheckCalendarData.id = idEvent;
                    workerCheckCalendarData.title = workerData['fio'] + " " + fieldsToCheckRu[key];
                    workerCheckCalendarData.start = workerData[key];
                    events.push(workerCheckCalendarData);
                }
            });

        });

        let calendar = new FullCalendar.Calendar(idDiv, {
            initialView: 'dayGridMonth',
            events,
        });
        calendar.render();
        changePageTitle("Календарь проверок");
    }).catch((e) => {
        console.log(e);
    });
}
