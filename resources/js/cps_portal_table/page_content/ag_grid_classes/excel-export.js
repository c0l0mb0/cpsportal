export let myExcelXML = (function () {
    let Workbook, WorkbookStart = '<?xml version="1.0"?><ss:Workbook  ' +
        'xmlns="urn:schemas-microsoft-com:office:spreadsheet" ' +
        'xmlns:o="urn:schemas-microsoft-com:office:office" ' +
        'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
        'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">';
    const WorkbookEnd = '</ss:Workbook>';
    let fs, SheetName = 'SHEET 1', styleID = 1, columnWidth = 80, fileName = "data", uri, link;

    class myExcelXML {
        constructor(o, tableName) {
            fileName = tableName + ".xls";
            let respArray = o;
            let finalDataArray = [];

            for (let i = 0; i < respArray.length; i++) {
                finalDataArray.push(flatten(respArray[i]));
            }

            let s = JSON.stringify(finalDataArray);
            fs = s.replace(/&/gi, '&amp;');
        }

        downLoad() {
            const Worksheet = myXMLWorkSheet(SheetName, fs);
            Workbook = WorkbookStart + Worksheet + WorkbookEnd;
            let fileNameToDownload = fileName;
            let blob = new Blob([Workbook], {type: 'text/xls'});
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveBlob(blob, fileNameToDownload);
            } else {
                let elem = window.document.createElement('a');
                elem.href = window.URL.createObjectURL(blob);
                elem.download = fileNameToDownload;
                document.body.appendChild(elem);
                elem.click();
                document.body.removeChild(elem);
            }
        }

        get fileName() {
            return fileName;
        }

        set fileName(n) {
            fileName = n;
        }

        get SheetName() {
            return SheetName;
        }

        set SheetName(n) {
            SheetName = n;
        }

        get styleID() {
            return styleID;
        }

        set styleID(n) {
            styleID = n;
        }
    }

    const myXMLWorkSheet = function (name, o) {
        const Table = myXMLTable(o);
        let WorksheetStart = '<ss:Worksheet ss:Name="' + name + '">';
        const WorksheetEnd = '</ss:Worksheet>';

        return WorksheetStart + Table + WorksheetEnd;
    }

    const myXMLTable = function (o) {
        let TableStart = '<ss:Table>';
        const TableEnd = '</ss:Table>';

        const tableData = JSON.parse(o);

        if (tableData.length > 0) {
            const columnHeader = Object.keys(tableData[0]);
            let rowData;
            for (let i = 0; i < columnHeader.length; i++) {
                TableStart += myXMLColumn(columnWidth);

            }
            for (let j = 0; j < tableData.length; j++) {
                rowData += myXMLRow(tableData[j], columnHeader);
            }
            // TableStart += myXMLHead(1, columnHeader);  //columns numbers
            TableStart += rowData;
        }

        return TableStart + TableEnd;
    }

    const myXMLColumn = function (w) {
        return '<ss:Column ss:AutoFitWidth="0" ss:Width="' + w + '"/>';
    }


    const myXMLHead = function (id, h) {
        let HeadStart = '<ss:Row ss:StyleID="' + id + '">';
        const HeadEnd = '</ss:Row>';

        for (let i = 0; i < h.length; i++) {
            const Cell = myXMLCell(h[i].toUpperCase());
            HeadStart += Cell;
        }

        return HeadStart + HeadEnd;
    }

    const myXMLRow = function (r, h) {
        let RowStart = '<ss:Row>';
        const RowEnd = '</ss:Row>';
        for (let i = 0; i < h.length; i++) {
            const Cell = myXMLCell(r[h[i]]);
            RowStart += Cell;
        }

        return RowStart + RowEnd;
    }

    const myXMLCell = function (n) {
        let CellStart = '<ss:Cell>';
        const CellEnd = '</ss:Cell>';

        const Data = myXMLData(n);
        CellStart += Data;

        return CellStart + CellEnd;
    }

    const myXMLData = function (d) {
        let DataStart = '<ss:Data ss:Type="String">';
        const DataEnd = '</ss:Data>';

        return DataStart + d + DataEnd;
    }

    const flatten = function (obj) {
        var obj1 = JSON.parse(JSON.stringify(obj));
        const obj2 = JSON.parse(JSON.stringify(obj));
        if (typeof obj === 'object') {
            for (var k1 in obj2) {
                if (obj2.hasOwnProperty(k1)) {
                    if (typeof obj2[k1] === 'object' && obj2[k1] !== null) {
                        delete obj1[k1]
                        for (var k2 in obj2[k1]) {
                            if (obj2[k1].hasOwnProperty(k2)) {
                                obj1[k1 + '-' + k2] = obj2[k1][k2];
                            }
                        }
                    }
                }
            }
            var hasObject = false;
            for (var key in obj1) {
                if (obj1.hasOwnProperty(key)) {
                    if (typeof obj1[key] === 'object' && obj1[key] !== null) {
                        hasObject = true;
                    }
                }
            }
            if (hasObject) {
                return flatten(obj1);
            } else {
                return obj1;
            }
        } else {
            return obj1;
        }
    }

    return myExcelXML;
})();
