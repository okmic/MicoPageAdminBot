import xlsx from 'xlsx'

class XlsxService {

    readXlsx(filePath: string) {

        const workbook = xlsx.readFile(filePath)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = xlsx.utils.sheet_to_json(worksheet)
        console.log(data)

    }

}

export default new XlsxService()