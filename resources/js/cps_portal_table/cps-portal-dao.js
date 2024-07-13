import {isIE11browser} from "./helper.js";

let url = window.location
let splitUrl = url.toString().split('/');
splitUrl = splitUrl.slice(0, -1);
let UrlPathWithoutLastDirectory = splitUrl.join("/")

export let config = {
    api: {
        getWarehouseRemainsALl: '/api/warehouse-remains-all',
        getWorkersALl: '/api/workers-all',
        postPutDeleteWorkers: '/api/workers',
        getExportAllNextWorkersChecksJson: '/api/export-all-next-workers-checks-json',
        postWorkersAddSixMonth: '/api/workers-add-six-month',
        getBuildingsALl: '/api/buildings-all',
        getBuildingsGroup1: '/api/buildings-group1',
        getBuildingsGroup2: '/api/buildings-group2',
        getBuildingsPlanGraf: '/api/buildings-plangraf',
        getBuildingsPlanGrafOrderedByPlGrafNumb: '/api/buildings-and-orederedplangraf',
        getBuildingsPlanGrafOrderedById: '/api/buildings-plangraf-by-id',
        getBuildingsAffiliate: '/api/buildings-affiliate',
        putUpdateBuildingSequenceOfPlanGraf: '/api/update-buildingplangraf-seq',
        postPutDeleteBuildings: '/api/buildings',
        getEquipmentALl: '/api/equipment-all',
        postPutDeleteEquipment: '/api/equipment',
        getPutDeleteEquipmentInBuilding: '/api/equipment-buildings',
        postCopyEquipmentFromFromOneBuildingToAnother: '/api/copy-equip-to-build',
        postDeleteEquipDuplicates: '/api/delete-equip-duplicates',
        getEquipmentUsage: '/api/equipment-usage',
        getUserRole: '/api/get-user-role',
        getExportNormiZapasaKip: '/api/export-normi-zapasa-kip',
        getExportPotrebnostMtr: '/api/export-potrebnost-mtr',
        getExportPassport: '/api/export-passport',
        getExportTep: '/api/export-tep',
        getExportPlanGrafic: '/api/export-plangrafic',
        getExportOtkaziIzveshatelei: '/api/export-otkazi-russianizveshateli',
        getExportAllData: '/api/export-all-data',
        getUserRoles: '/api/get-user-roles',
        getPutDeleteEquipmentInBuildingWithWorkerChanges: '/api/equipment-buildings-with-worker-changes',
        postLogOut: '/logout',
        loginURL: '/login',
    }
};

Object.keys(config.api).forEach(key => {
    config.api[key] = UrlPathWithoutLastDirectory + config.api[key];
});

export function httpRequest(url, method, data = null, idRow = null) {
    if (idRow !== null) url += '/' + idRow;

    return new Promise(function (resolve, reject) {
        let oReq = new XMLHttpRequest();
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

export function downloadFile(url, method, data = null) {
    let oReq = new XMLHttpRequest();
    oReq.open(method, url, true);
    oReq.responseType = "blob";
    oReq.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    oReq.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    oReq.onload = function (event) {
        let blob = oReq.response;
        let filename = '';
        let disposition = oReq.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            let matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = decodeURI(filename);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };
    oReq.onerror = function (event) {
        console.log(event);
    };

    oReq.send(JSON.stringify(data));
}


