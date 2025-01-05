import { PrismaClient } from "@prisma/client"
import { MyContext } from "../../types"
import { NextFunction } from "grammy"

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
                    await this.ctx.reply("Введите ваши данные ниже 👇")
                    this.ctx.session.waitngFromUpdateContent[this.ctx.from.id][key] = {startAgreement: true}
                    return
                } else {
                    delete this.ctx.session.waitngFromUpdateContent[this.ctx.from.id]
                    this.ctx.reply("Обновление отменено")
                    return
                }
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
