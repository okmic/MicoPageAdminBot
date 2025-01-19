import { Bot } from "grammy"
import { MyContext } from "../../types"

class AdminTelegramFtpService {

    bot: Bot
    ctx: MyContext

    constructor(ctx, bot) {
        this.ctx = ctx
        this.bot = bot
    }

    async handleAddFtpUser() {
    }

}