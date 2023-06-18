import {isIE11browser} from "./helper.js";

let url = window.location
let splitUrl = url.toString().split('/');
splitUrl = splitUrl.slice(0, -1);
let UrlPathWithoutLastDirectory = splitUrl.join("/")

export let config = {
    api: {
        getWorkersALl: '/api/workersall',
        postPutDeleteWorkers: '/api/workers',
        postWorkersAddSixMonth: '/api/workers-add-six-month',
        getBuildingsALl: '/api/cps-buildings-all',
        getBuildingsGroup1: '/api/cps-buildings-group1',
        getBuildingsGroup2: '/api/cps-buildings-group2',
        getBuildingsAffiliate: '/api/cps-buildings-affiliate',
        postPutDeleteBuildings: '/api/cps-buildings',
        getEquipmentALl: '/api/cps-equipment-all',
        postPutDeleteEquipment: '/api/cps-equipment',
        getPutDeleteEquipmentInBuilding: '/api/cps-equipment-buildings',
        getUserRole: '/api/get-user-role',
        getExportNormiZapasaKip: '/api/export-normi-zapasa-kip',
        getExportPotrebnostMtr: '/api/export-potrebnost-mtr',
    }
};

Object.keys(config.api).forEach(key => {
    config.api[key] = UrlPathWithoutLastDirectory + config.api[key];
});

export function httpRequest(url, method, data = null, idRow = null) {
    if (idRow !== null) url += '/' + idRow;

    return new Promise(function (resolve, reject) {
        var oReq = new XMLHttpRequest();
        // oReq.responseType = 'json'; ie11 compatibility
        oReq.open(method, url, true);
        oReq.responseType = "json";
        oReq.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        oReq.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        oReq.onload = function () {
            if (oReq.status >= 200 && oReq.status < 300) {
                if (isIE11browser) { //ie11 compatibility
                    let res = JSON.parse(oReq.response);
                    resolve(res);
                } else {
                    let res = JSON.stringify(oReq.response);
                    res = JSON.parse(res);
                    resolve(res);
                }
            } else {
                reject({
                    status: oReq.status,
                    statusText: oReq.statusText
                });
            }
        };
        oReq.onerror = function () {
            reject({
                status: oReq.status,
                statusText: oReq.statusText
            });
        };
        oReq.send(JSON.stringify(data));
    });
}

export function downloadFile(url) {
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "blob";
    oReq.onload = function (event) {
        var blob = oReq.response;
        var fileName = oReq.getResponseHeader("fileName") //if you have the fileName header available
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url)
    };

    oReq.send();
}


