import { Bot } from "grammy"
import { MyContext } from "../types"
import AdminTelegramMessageActionService from "../services/admin.telegram.message.action.service"
import AdminTelegramButtonsActionService from "../services/admin.telegram.buttons.action.service"

class AdminTelegramActionsController {

    private bot: Bot<MyContext>

    constructor(bot) {
        this.bot = bot
    }

    async handleActions() {
      new AdminTelegramMessageActionService(this.bot).handleMessage()
      new AdminTelegramButtonsActionService(this.bot).handleButtons()
    }

}

export default AdminTelegramActionsController