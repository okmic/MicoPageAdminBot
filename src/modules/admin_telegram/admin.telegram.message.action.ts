import { Bot } from "grammy";
import { MyContext } from "./types";
import TelegramAdminContentUpdateMsgService from "./content/update/telegram.admin.content.update.msg.service";

export default class AdminTelegramMessageAction {

    bot: Bot<MyContext>

    constructor(bot) {
        this.bot = bot
    }

    handleMessage() {
        try {
            
            this.bot.on("msg", async (ctx, next) => {
                await new TelegramAdminContentUpdateMsgService(ctx, next).handleMsgUpdates()
                console.log("2")
            })

        } catch (e) {
            console.error(e)
        }
    }

}