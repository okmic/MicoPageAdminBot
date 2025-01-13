import { Bot } from 'grammy'
import path from 'path'
import { getPath, storageChecked } from '../../../../../helper'
import { MyContext } from '../../../types'
import { v4 } from 'uuid'
import { TKeysXlsxContentMassUpdate } from '../../../../xlsx/types'
import xlsxService from '../../../../xlsx/xlsx.service'
import { getUserData } from '../../../../utils/user.helper'
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
      const user = await getUserData(this.ctx)
      const storagePath = getPath("storage")
      storageChecked(path.join(storagePath, user.adminTgChatId))
      storageChecked(path.join(storagePath, user.adminTgChatId, 'xlsx'))
      const pathToUserStoreXlsx = path.join(storagePath, user.adminTgChatId, 'xslx')

      const file = await this.ctx.getFile()

      const fileName = `${v4()}_${formatDate(new Date("2024-05-01"))}.xlsx`

      await downloadFile(file.file_path, pathToUserStoreXlsx, fileName, this.bot.token)

      const result = await xlsxService.readXlsx(pathToUserStoreXlsx + `/${fileName}`, this.key)

      return await this.ctx.reply(result)
    } catch (e) {
      console.error(e)
    }
  }

}
