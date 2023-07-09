import fs from "fs";

const isDate = (string) => {
    if (new Date(string) === "Invalid Date") return false
    if (isNaN(new Date(string))) return false
    if (string.includes("копия")) return false
    return true
}
const convert = async () => {
    const fs = require('fs')

    const {mtime} = fs.statSync('../FAN Orders Romania.xlsx');
    let cache = {}
    try {
        cache = JSON.parse(fs.readFileSync('cache.json'))
    } catch (e) {
    }
    if (mtime.toString() !== cache.lastUpdate) {
        fs.readdirSync('excels').forEach(f => fs.rmSync(`excels/${f}`));
        const Excel = require('exceljs')
        const workbook = new Excel.Workbook();
        await workbook.xlsx.readFile('../FAN Orders Romania.xlsx');
        const sheets = []
        let i = 1;

        workbook.eachSheet(function (worksheet, sheetId) {
            if ((worksheet.name==="07.07.2023 ")) {
                const name=worksheet.name.trim().replaceAll(",",".")

                const sheet = []
                worksheet.eachRow(function (row, rowNumber) {
                    if (row.getCell(1).fill?.fgColor?.argb === "FFFFFFFF"||!row.getCell(1).fill?.fgColor?.argb) {
                        const cells = [name]
                        row.eachCell({includeEmpty: true}, function (cell) {
                            cells.push(cell.text.trim())
                        });
                        sheet.push(cells)
                    }
                });
                fs.writeFileSync('excels/' + (i++) +"_"+ name + '.json', JSON.stringify(sheet))
                sheets.push(sheet)
            }

        });
        cache.lastUpdate = mtime.toString()
        fs.writeFileSync('cache.json', JSON.stringify(cache))
        return sheets[0]
    } else {
        const files= fs.readdirSync('excels' )
        const name=files.find(name=>name.indexOf("1_")===0)
        return JSON.parse(fs.readFileSync("excels/" + name))

    }
}
export {convert}