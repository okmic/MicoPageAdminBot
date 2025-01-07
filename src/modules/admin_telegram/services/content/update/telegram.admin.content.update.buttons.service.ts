import { PrismaClient } from "@prisma/client"
import { MyContext } from "../../../types"
import { InputFile, NextFunction } from "grammy"
import { ErrorTelegramStopExecution } from "../../../../errors"
import TelegramAdminContentUpdateMsgService from "./telegram.admin.content.update.msg.service"
import { join } from "path"
import fs from "fs/promises"

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

                    if(key === "products") {
                       try {
                            await this.ctx.reply("Пожалуйста, отправьте мне файл в формате xlsx с продуктами. Вот пример того, как он должен выглядеть:")
                            await this.ctx.replyWithDocument(new InputFile(join(__dirname, "..", "..", "..", "..", "..", "..", "tempsResponse", "temp-products.xlsx")))
                       } catch (e) {
                            console.error(e)
                       }
                    }

                    await this.ctx.reply("Введите ваши данные ниже 👇")
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
