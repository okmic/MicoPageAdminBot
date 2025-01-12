import { Bot } from "grammy";
import { MyContext } from "../../types";
import TelegramAdminContentUpdateMsgService from "../content/update/telegram.admin.content.update.msg.service";
import adminTelegramMenuService from "../admin.telegram.menu.service";

export default class AdminTelegramMessageActionService {

    bot: Bot<MyContext>

    constructor(bot) {
        this.bot = bot
    }

    async handleMessage() {
        try {

            this.bot.on("msg", async (ctx, next) => {
                await adminTelegramMenuService.handleMenuSelection(ctx)
                await new TelegramAdminContentUpdateMsgService(ctx, next).handleMsgUpdates()

            })

        } catch (e) {
            console.error(e)
        }
    }

}