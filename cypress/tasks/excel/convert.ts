const convert = async () => {
    const Excel = require('exceljs')
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile('../FAN Orders Romania.xlsx');
    const sheets = []
    let i = 1;

    for(const i in workbook._worksheets){
        const current=workbook._worksheets[i]
        const name = current?.name.replaceAll(",", ".")
        if(name && current.state!=='hidden'){
            const sheet = []
            current.eachRow(function (row, rowNumber) {
                if (row.getCell(1).fill?.fgColor?.argb === "FFFFFFFF" || !row.getCell(1).fill?.fgColor?.argb) {
                    const cells = [name]
                    row.eachCell({includeEmpty: true}, function (cell) {
                        cells.push(cell.text.trim())
                    });
                    sheet.push(cells)
                }
            });
            sheets.push(sheet)

            return sheets[0]
        }

    }



}
export {convert}