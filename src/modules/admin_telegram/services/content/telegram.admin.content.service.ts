import { PrismaClient } from "@prisma/client"
import { Context } from "grammy"
import ejs from "ejs"
import path from "path"
import fs from "fs"
import { InlineKeyboard } from "grammy"

class TelegramAdminContentService {
    private prismaClient: PrismaClient

    constructor() {
        this.prismaClient = new PrismaClient()
    }

    private async renderTemplate(templateName: string, data: object): Promise<string> {
        const templatePath = path.join(__dirname, "..", "..", "..", "..", 'temps', `${templateName}.ejs`)
        const template = fs.readFileSync(templatePath, 'utf-8')
        return ejs.render(template, data)
    }

    async getContentDetailsCommand(ctx: Context) {
        const content = await this.prismaClient.content.findFirst({
            include: {
                services: {
                    include: {
                        items: true
                    }
                },
                works: true,
                socialMedia: true,
                products: true
            }
        })

        if (!content) {
            return ctx.reply('Контент не найден.')
        }

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
    }

    async handleCallbackQuery(ctx: Context) {
        const content = await this.prismaClient.content.findFirst({
            include: {
                services: {
                    include: {
                        items: true
                    }
                },
                works: true,
                socialMedia: true,
                products: true
            }
        })

        if (!content) {
            return ctx.answerCallbackQuery('Контент не найден.')
        }

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
            default
            :
            return ctx.answerCallbackQuery('Неизвестное действие.')
    }

    await ctx.answerCallbackQuery() 
    await ctx.reply(message, { parse_mode: 'Markdown' })
}
}

export default new TelegramAdminContentService()
