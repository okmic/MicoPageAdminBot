import { ErrorTelegramStopExecution } from "../../../errors";
import FTPService from "../../../ftp/ftp.service";
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

        //build project
        await this.ctx.reply("Начинаю сборку проекта...")
        
        //con to ftp
        await this.ctx.reply("Подключение к ftp серверу...")
        /*      const resultDeploy = await new FTPService() */
        
        //deploying
        await this.ctx.reply("Развертывание на ftp сервере...")

        //deployer
        await this.ctx.reply("Все прошло успешно, сайт обновлен!")

        throw new ErrorTelegramStopExecution()

    }
}