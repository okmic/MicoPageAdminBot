import { Bot } from "grammy"
import { MyContext } from "../types"
import AdminTelegramMessageActionService from "../services/actions/admin.telegram.message.action.service"
import AdminTelegramButtonsActionService from "../services/actions/admin.telegram.buttons.action.service"
import AdminTelegramImagesActionService from "../services/actions/admin.telegram.images.action.service"

class AdminTelegramActionsController {

    private bot: Bot<MyContext>

    constructor(bot) {
        this.bot = bot
    }

    async handleActions() {
      new AdminTelegramMessageActionService(this.bot).handleMessage()
      new AdminTelegramButtonsActionService(this.bot).handleButtons()
      new AdminTelegramImagesActionService(this.bot).handleImages()
    }

}

export default AdminTelegramActionsController