import { Bot } from "grammy"
import { MyContext } from "../types"
import AdminTelegramMessageActionService from "../services/actions/admin.telegram.message.action.service"
import AdminTelegramButtonsActionService from "../services/actions/admin.telegram.buttons.action.service"
import AdminTelegramFilesActionService from "../services/actions/admin.telegram.files.action.service"

class AdminTelegramActionsController {

    private bot: Bot<MyContext>

    constructor(bot) {
        this.bot = bot
    }

    async handleActions() {
      new AdminTelegramFilesActionService(this.bot).handleFiles()
      await new AdminTelegramMessageActionService(this.bot).handleMessage()
      new AdminTelegramButtonsActionService(this.bot).handleButtons()
    }

}

export default AdminTelegramActionsController