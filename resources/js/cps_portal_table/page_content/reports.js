import {config} from "../cps-portal-dao";


export function createReportsForm(idPageContent) {
    let reportList = document.createElement('ul');
    idPageContent.appendChild(reportList);

    addLinkToReports("Нормы запаса КИПиСА", config.api.getExportNormiZapasaKip, reportList);
    addLinkToReports("Потребность МТР", config.api.getExportPotrebnostMtr, reportList);
    addLinkToReports("Все данные", config.api.getExportAllData, reportList);
    addLinkToReports("Отказы извещателей ", config.api.getExportOtkaziIzveshatelei, reportList);
}

function addLinkToReports(linkName, LinkURL, reportList) {
    let exportTestLiTag = document.createElement('li');
    exportTestLiTag.classList.add("export_list-item");
    reportList.appendChild(exportTestLiTag);
    let exportTestAtag = document.createElement('a');
    exportTestLiTag.appendChild(exportTestAtag);
    exportTestAtag.innerText = linkName;
    exportTestAtag.href = LinkURL;
}
