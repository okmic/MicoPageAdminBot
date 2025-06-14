import ejs from "ejs"
import fs from "fs"
import { InlineKeyboard } from "grammy"
import { getPath } from "../../../../helper"
import { getSiteContent } from "../../utils/telegram.content.helper"
import { MyContext } from "../../types"
import { Content } from "@prisma/client"

class TelegramAdminContentService {

    private async renderTemplate(templateName: string, data: Content): Promise<string> {
        const templatePath = getPath("systemTempsFiles") + `/${templateName}.ejs`
        const template = fs.readFileSync(templatePath, 'utf-8')
        return ejs.render(template, data)
    }

    async getContentDetailsCommand(ctx: MyContext) {
        try {    
            const keyboard = new InlineKeyboard()
                .text("Основная информация", "mainInfo")
                .row()
                .text("Работы", "works")
                .row()
                .text("Услуги", "services")
                .row()
                .text("Социальные медиа", "socialMedia")
                .row()
                .text("Продукты", "products")
    
            await ctx.reply("Выберите раздел для получения информации:", { reply_markup: keyboard })
        } catch (e) {
            console.error(e)
        }
    }

    async handleCallbackQuery(ctx: MyContext) {

        const userData = ctx.session.storageUsersData[ctx.from.id]
       
        if (!userData || !userData.user || !userData.selectedSite) {
            return ctx.answerCallbackQuery('Контент не найден.')
        }
        const {content} = await getSiteContent(userData.user.id, userData.selectedSite.siteId, userData.selectedSite.contentId) 
        const action = ctx.callbackQuery.data

        let message: string

        switch (action) {
            case "mainInfo":
                message = await this.renderTemplate('mainInfo', content)
                break
            case "works":
                message = await this.renderTemplate('works', content)
                break
            case "services":
                message = await this.renderTemplate('services', content)
                break
            case "socialMedia":
                message = await this.renderTemplate('socialMedia', content)
                break
            case "products":
                message = await this.renderTemplate('products', content)
                break
            default: return ctx.answerCallbackQuery('Неизвестное действие.')
    }
    await ctx.answerCallbackQuery() 
    await ctx.reply(message, { parse_mode: 'Markdown' })
}
}

export default new TelegramAdminContentService()
