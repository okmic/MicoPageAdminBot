import { PrismaClient } from "@prisma/client"
import { MyContext } from "../../../../types"
import { NextFunction } from "grammy"
import { ErrorTelegramStopExecution } from "../../../../../errors"
import TelegramAdminContentUpdateMsgService from "../telegram.admin.content.update.msg.service"
import TelegramAdminContentUpdateButtonsXlsxService from "./telegram.admin.content.update.buttons.xlsx.service"

class TelegramAdminContentUpdateButtonsService {

    private prismaClient: PrismaClient
    private ctx: MyContext
    private next: NextFunction

    constructor(ctx: MyContext, next: NextFunction) {
        this.prismaClient = new PrismaClient()
        this.ctx = ctx
        this.next = next
    }

    async handleButtonPress() {
        try {
            const cbData = this.ctx.callbackQuery.data
            
            if(/adminUpdateContentAgreement/.test(cbData)) {
                const {key, uAnswer} = this.getParamsInString(cbData)
                if(!key || !uAnswer) return

                if(uAnswer === "true") {
                    //checked update with file actions
                    await new TelegramAdminContentUpdateButtonsXlsxService(this.ctx, key).handleActionsXlsxContents()

                    await this.ctx.reply("Жду ваших данных! 👇")
                    this.ctx.session.waitngFromUpdateContent[this.ctx.from.id][key] = {startAgreement: true}
                    return
                } else {
                    delete this.ctx.session.waitngFromUpdateContent[this.ctx.from.id]
                    this.ctx.reply("Обновление отменено")
                    return
                }
            }  if(/updateContent/.test(cbData)) {
                const {key} = this.getParamsInString(cbData)
                if(!key) throw new ErrorTelegramStopExecution()
                delete this.ctx.session.waitngFromUpdateContent[this.ctx.from.id]
                this.ctx.session.updateContent[this.ctx.from.id] = key
                await new TelegramAdminContentUpdateMsgService(this.ctx, this.next).handleMsgUpdates()
                return
            }

        } catch (e) {
            throw e
        }
    }
    
    private getParamsInString(str: string) {

        const parts = str.split(' ').slice(1)
        const params: any = {}

        for (const part of parts) {
            const [key, value] = part.split('=')
            if (key && value) {
                params[key] = value
            }
        }

        return params
    }
    
}

export default TelegramAdminContentUpdateButtonsService
