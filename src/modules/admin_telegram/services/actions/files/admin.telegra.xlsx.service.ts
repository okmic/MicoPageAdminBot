import { Bot } from 'grammy'
import path from 'path'
import { getPath, storageChecked } from '../../../../../helper'
import { MyContext } from '../../../types'
import { v4 } from 'uuid'
import { TKeysXlsxContentMassUpdate } from '../../../../xlsx/types'
import xlsxService from '../../../../xlsx/xlsx.service'
import { downloadFile, formatDate } from '../../../utils/telegram.files.helper'

export default class AdminTelegramXlsxService {
  private ctx: MyContext
  private bot: Bot
  private key: TKeysXlsxContentMassUpdate

  constructor(ctx: MyContext, bot: Bot, key: TKeysXlsxContentMassUpdate) {
    this.ctx = ctx
    this.bot = bot
    this.key = key
  }


  async saveXlsx() {
    try {
      const {user} = this.ctx.session.storageUsersData[this.ctx.from.id]
      const storagePath = getPath("adminTelegramXlsx")
      storageChecked(path.join(storagePath, user.adminTgChatId))
      storageChecked(path.join(storagePath, user.adminTgChatId, 'xlsx'))
      const pathToUserStoreXlsx = path.join(storagePath, user.adminTgChatId, 'xlsx')

      const file = await this.ctx.getFile()

      const fileName = `${v4()}_${formatDate(new Date())}.xlsx`

      const resultPath = await downloadFile(file.file_path, pathToUserStoreXlsx, fileName, this.bot.token)

      const result = await xlsxService.readXlsx(resultPath, this.key)
      this.ctx.session.waitngFromUpdateContent[this.ctx.from.id] = undefined
      return await this.ctx.reply(result)
    } catch (e) {
      console.error(e)
    }
  }

}
