import { ErrorTelegramStopExecution } from "../../../errors";
import { universalMsgs } from "../../controllers/admin.telegram.messages.controller";
import { MyContext } from "../../types";
import { getContent, getSiteContent } from "../../utils/telegram.content.helper";

export default class AdminTelegramDeployButtons {

    ctx: MyContext

    constructor(ctx: MyContext) {
        this.ctx = ctx
    }

    async handleButton() {


        if(!this.ctx.callbackQuery.data || !/deployContentId/.test(this.ctx.callbackQuery.data)) return
        const id = Number(this.ctx.callbackQuery.data.split(" ")[1])

        if(!id) {
            await this.ctx.reply(universalMsgs.defaultErrorMsg)
            throw new ErrorTelegramStopExecution()
        }
        const content = await getContent(id)
        if (!content) {
            return this.ctx.answerCallbackQuery('Контент не найден.')
        }

        await this.ctx.reply(String(id))
        throw new ErrorTelegramStopExecution()
    }
}