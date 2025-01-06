import { Bot } from "grammy";
import { MyContext } from "../types";
import TelegramAdminContentUpdateButtonsService from "./content/update/telegram.admin.content.update.buttons.service"

export default class AdminTelegramButtonsActionService {

    bot: Bot<MyContext>

    constructor(bot) {
        this.bot = bot
    }

    handleButtons() {
        try {
            
            this.bot.on("callback_query", async (ctx, next) => {
                await new TelegramAdminContentUpdateButtonsService(ctx, next).handleButtonPress()
                console.log("2")
            })

        } catch (e) {
            console.error(e)
        }
    }

}