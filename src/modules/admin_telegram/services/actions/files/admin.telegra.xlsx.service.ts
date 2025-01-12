import { Bot } from 'grammy'
import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import { getPath, storageChecked } from '../../../../../helper'
import { MyContext } from '../../../types'
import { v4 } from 'uuid'
import { TKeysXlsxContentMassUpdate } from '../../../../xlsx/types'
import xlsxService from '../../../../xlsx/xlsx.service'

export default class AdminTelegramXlsxService {
  private ctx: MyContext
  private pathToUserStoreXlsx: string
  private bot: Bot
  private key: TKeysXlsxContentMassUpdate

  constructor(ctx: MyContext, bot: Bot, key: TKeysXlsxContentMassUpdate) {
    this.ctx = ctx
    const userId = this.ctx.from.id
    const storagePath = getPath("storage")
    storageChecked(path.join(storagePath, userId.toString()))
    storageChecked(path.join(storagePath, userId.toString(), 'xlsx'))
    this.pathToUserStoreXlsx = path.join(storagePath, userId.toString(), 'xslx')
    this.bot = bot
    this.key = key
  }


  async saveXlsx() {
    try {
      const file = await this.ctx.getFile()

      const fileName = `${v4()}_${this.formatDate(new Date("2024-05-01"))}.xlsx`

      await this.downloadFile(file.file_path, this.pathToUserStoreXlsx, fileName)

      const result = await xlsxService.readXlsx(this.pathToUserStoreXlsx + `/${fileName}`, this.key)

      return await this.ctx.reply(result)
    } catch (e) {
      console.error(e)
    }
  }

  async downloadFile(tgFilePath: string, savePath: string, fileName: string) {

    const url = `https://api.telegram.org/file/bot${this.bot.token}/${tgFilePath}`
    const response = await fetch(url)

    if (!response.ok) throw new Error(`Ошибка при загрузке файла: ${response.statusText}`)

    const buffer = await response.buffer()

    await fs.writeFile(savePath + `/${fileName}`, buffer)
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }
}
