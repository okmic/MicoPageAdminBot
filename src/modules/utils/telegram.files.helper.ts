import fs from "fs/promises"
import axios from 'axios'

export function formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}


export async function downloadFile(tgFilePath: string, savePath: string, fileName: string, botToken: string) {
  
  const url = `https://api.telegram.org/file/bot${botToken}/${tgFilePath}`;

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    })

    if (response.status !== 200) {
      throw new Error(`Ошибка при загрузке файла: ${response.statusText}`)
    }

    await fs.writeFile(`${savePath}/${fileName}`, response.data)

    return `${savePath}/${fileName}`
  } catch (e) {
    throw new Error(`Ошибка при загрузке файла: ${e}`)
  }
}
