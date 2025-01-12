import AdmZip from 'adm-zip'
import fs from 'fs'
import { rm } from 'fs/promises'
import path from 'path'
import { Bot } from 'grammy'
import axios from 'axios'
import { getPath, storageChecked } from '../../../../../helper'
import { MyContext } from '../../../types'

export default class AdminTelegramZipService {
  private ctx: MyContext
  private pathToUserSite: string

  constructor(ctx: MyContext) {
    this.ctx = ctx
    const userId = this.ctx.from.id
    const storagePath = getPath("storage")
    storageChecked(path.join(storagePath, userId.toString()))
    storageChecked(path.join(storagePath, userId.toString(), 'mico-page'))
    this.pathToUserSite = path.join(storagePath, userId.toString(), 'mico-page')
  }

  async downloadAndExtractZip(fileId: string, bot: Bot): Promise<void> {
    const file = await bot.api.getFile(fileId)
    const zipFilePath = path.join(this.pathToUserSite, path.basename(file.file_path))
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`

    const response = await axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream'
    })

    const fileStream = fs.createWriteStream(zipFilePath)

    return new Promise((resolve, reject) => {
      response.data.pipe(fileStream)
      fileStream.on('finish', async () => {
        fileStream.close()
        try {
          const zip = new AdmZip(zipFilePath)
          zip.extractAllTo(this.pathToUserSite, true)
          await rm(zipFilePath) // Удаляем ZIP-файл после распаковки
          resolve()
        } catch (error) {
          reject(error)
        }
      })
      fileStream.on('error', (err) => {
        reject(err)
      })
    })
  }
}
