import { Bot } from 'grammy'
import path from 'path'
import { getPath, storageChecked } from '../../../../../helper'
import { MyContext } from '../../../types'
import { v4 } from 'uuid'
import { getUserData } from '../../../../utils/user.helper'
import { downloadFile, formatDate } from '../../../utils/telegram.files.helper'

export default class AdminTelegramImgService {

  private ctx: MyContext
  private bot: Bot
  private extension: string = "jpg"

  constructor(ctx: MyContext, bot: Bot, extension: string) {
    this.ctx = ctx
    this.bot = bot
    this.extension = extension
  }

  async saveImage() {
    
    const user = await getUserData(this.ctx)
    const storagePath = getPath("storage")
    storageChecked(path.join(storagePath, user.adminTgChatId))
    storageChecked(path.join(storagePath, user.adminTgChatId, 'images'))
    const pathToUserStoreImg = path.join(storagePath, user.adminTgChatId, 'images')

    const file = await this.ctx.getFile()

    const filePath = file.file_path

    if (filePath) {
      const parts = filePath.split('.')
      if (parts.length > 1) this.extension = parts.pop()
    }

    const fileName = `${v4()}_${formatDate(new Date())}.${this.extension}`

    await downloadFile(file.file_path, pathToUserStoreImg, fileName, this.bot.token)
    const resultPath = getPath("PublicPathToTelegramImages") + `/${this.ctx.from.id}/${fileName}`

    return resultPath
  }
  
}
