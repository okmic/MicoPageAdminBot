import { Bot } from "grammy"
import { MyContext } from "../../types"

export default class AdminTelegramFtpService {

    bot: Bot
    ctx: MyContext

    constructor(ctx, bot) {
        this.ctx = ctx
        this.bot = bot
    }

    async handleAddFtpUser() {
        
    }

}