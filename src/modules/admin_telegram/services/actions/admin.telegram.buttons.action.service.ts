import { Bot } from "grammy";
import { MyContext } from "../../types";
import TelegramAdminContentUpdateButtonsService from "../content/update/telegram_admin_content_update_buttons/telegram.admin.content.update.buttons.service"
import telegramAdminContentService from "../content/telegram.admin.content.service";
import AdminTelegramDeployButtons from "../deploy/admin.telegram.deploy.buttons";
import { ErrorTelegramStopExecution } from "../../../errors";

export default class AdminTelegramButtonsActionService {

    bot: Bot<MyContext>

    constructor(bot) {
        this.bot = bot
    }

    handleButtons() {
        try {
            
            this.bot.on("callback_query", async (ctx, next) => {
                try {
                    await new TelegramAdminContentUpdateButtonsService(ctx, next).handleButtonPress()
                    await new AdminTelegramDeployButtons(ctx).handleButton()
                    await telegramAdminContentService.handleCallbackQuery(ctx)
                } catch (e) {
                    if(e instanceof ErrorTelegramStopExecution) return
                    throw e
                }
            })
            
        } catch (e) {
            console.error(e)
        }
    }

}