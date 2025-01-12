import { Bot } from 'grammy'
import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import { getPath, storageChecked } from '../../../../../helper'
import { MyContext } from '../../../types'
import { v4 } from 'uuid'

export default class AdminTelegramImgService {
  private ctx: MyContext
  private pathToUserStoreImg: string
  private bot: Bot
  private extension: string = "jpg"

  constructor(ctx: MyContext, bot: Bot, extension: string) {
    this.ctx = ctx
    const userId = this.ctx.from.id
    const storagePath = getPath("storage")
    storageChecked(path.join(storagePath, userId.toString()))
    storageChecked(path.join(storagePath, userId.toString(), 'images'))
    this.pathToUserStoreImg = path.join(storagePath, userId.toString(), 'images')
    this.bot = bot
    this.extension = extension
  }

  async saveImage() {
    const file = await this.ctx.getFile()

    const filePath = file.file_path

    if (filePath) {
      const parts = filePath.split('.')
      if (parts.length > 1) this.extension = parts.pop()
    }

    const fileName = `${v4()}_${this.formatDate(new Date("2024-05-01"))}.${this.extension}`

    await this.downloadFile(file.file_path, this.pathToUserStoreImg, fileName)
    const resultPath = getPath("PublicPathToTelegramImages") + `/${this.ctx.from.id}/${fileName}`

    return resultPath
  }

  private async downloadFile(tgFilePath: string, savePath: string, fileName: string) {

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
