import AdmZip from 'adm-zip'
import path from 'path'
import { Bot } from 'grammy'
import { getPath, storageChecked } from '../../../../../helper'
import { MyContext } from '../../../types'
import { getUserData } from '../../../../utils/user.helper'
import { downloadFile } from '../../../utils/telegram.files.helper'

export default class AdminTelegramZipService {
  private ctx: MyContext
  private bot: Bot

  constructor(ctx: MyContext, bot: Bot) {
    this.ctx = ctx
    this.bot = bot
  }

  async downloadAndExtractZip(fileId: string, hashSite: string): Promise<void> {
    const user = await getUserData(this.ctx)
    const storagePath = getPath("storage")
    storageChecked(path.join(storagePath, user.adminTgChatId))
    storageChecked(path.join(storagePath, user.adminTgChatId, 'mico-page'))
    storageChecked(path.join(storagePath, user.adminTgChatId, 'mico-page', hashSite))
    const pathToUserSite = path.join(storagePath, user.adminTgChatId, 'mico-page', hashSite)

    const file = await this.bot.api.getFile(fileId)
    const zipFilePath = file.file_path

    const response = await downloadFile(zipFilePath, pathToUserSite, path.basename(zipFilePath), this.bot.token)

    const zip = new AdmZip(response)
    zip.extractAllTo(pathToUserSite, true)
  }
}
