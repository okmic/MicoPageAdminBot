import { PrismaClient } from "@prisma/client"
import { AdminContentUpdateMethodNames, KeyContentUpdate, MyContext } from "../../../types"
import { InlineKeyboard, NextFunction } from "grammy"
import adminTelegramResponseText from "../../admin.telegram.response.text.service"
import { join } from "path"

class TelegramAdminContentUpdateMsgService {

    private prisma: PrismaClient
    private ctx: MyContext
    private next: NextFunction

    constructor(ctx: MyContext, next: NextFunction) {
        this.prisma = new PrismaClient()
        this.ctx = ctx
        this.next = next
    }

    async handleMsgUpdates() {
        try {
            const userId = this.ctx.from.id
            const waitingSession = this.ctx.session.waitngFromUpdateContent[userId]
            const updateSession = this.ctx.session.updateContent[userId]

            if (waitingSession) return await this[waitingSession.methodName](false)

            if (updateSession) return await this.handleUpdateSession(updateSession)

            return await this.next()

        } catch (e) {
            throw e
        }
    }

    private async handleUpdateSession(updateType: KeyContentUpdate) {
        switch (updateType) {
            case "someUpdate":
                return await this.handleSomeUpdate()
            case "phone":
                return await this.handlePhone(true)
            case "email":
                return await this.handleEmail(true)
            case "products":
                return await this.handleProducts(true)
            default:
                return await this.next()
        }
    }

    private async handleSomeUpdate() {

        const keyboard = new InlineKeyboard()
            .text("Название сайта", "updateContent key=logoName")
            .text("Описание компании", "updateContent key=companyDescription")
            .row()
            .text("Название сайта", "updateContent key=logoName")
            .text("Лого Изображение", "updateContent key=logoImgUrl")
            .row()
            .text("Почту", "updateContent key=email")
            .text("Номер телефона", "updateContent key=phone")
            .row()
            .text("Адресс", "updateContent key=address")
            .text("Главная заголовок", "updateContent key=mainBlockTitle")
            .row()
            .text("Главное описание", "updateContent key=mainBlockDescription")
            .text("Изображение главного блока", "updateContent key=mainBlockImgUrl")
            .row()
            .text("Блок о работе", "updateContent key=works")
            .text("Блок Услуг", "updateContent key=services")
            .row()
            .text("Блок Социальных сетей", "updateContent key=socialMedia")
            .text("Блок Продуктов", "updateContent key=products")

        await this.ctx.reply("Выберите раздел для обновления:", { reply_markup: keyboard })

    }

    private async handleProducts(isFirst: boolean) {

        const session = this.ctx.session.waitngFromUpdateContent[this.ctx.from.id]

        if (isFirst) return await this.sendConfirmationKeyboard("products", "Вы хотите обновить список продуктов на сайте?")
        
        if (session.products && session.products.startAgreement && session.products.startAgreement) {
            if(this.ctx.message.text === "stop") {

                delete this.ctx.session.waitngFromUpdateContent[this.ctx.from.id]
                delete this.ctx.session.updateContent[this.ctx.from.id]
                await this.ctx.reply(`Действия отменено!`)
                return 
                
            }
            await this.ctx.reply(`Необходим файл xlsx!\n\nДля отмены действия просто напишите мне "stop"!`)
        }
    }

    private async handlePhone(isFirst: boolean) {

        const session = this.ctx.session.waitngFromUpdateContent[this.ctx.from.id]

        if (isFirst) return await this.sendConfirmationKeyboard("phone", "Вы хотите обновить телефон на сайте?")
        
        if (session.phone && session.phone.startAgreement && !session.phone.phoneNumber) {
            
            const phone = this.validatePhone(this.ctx.message.text)
            if (!phone) return await this.ctx.reply(adminTelegramResponseText.msgErrorValidPhone)

            await this.updateContent(session.key, phone)
            await this.ctx.reply("Номер телефона записан и обновлен на сайте!")
            return

        }

    }

    private async handleEmail(isFirst: boolean) {
        const session = this.ctx.session.waitngFromUpdateContent[this.ctx.from.id]

        if (isFirst) {
            return await this.sendConfirmationKeyboard("email", "Вы хотите обновить почту на сайте?")
        } 

        if (session.email && session.email.startAgreement && !session.email.email) {
            const email = this.validateEmail(this.ctx.message.text)
            if (!email) return await this.ctx.reply(adminTelegramResponseText.msgErrorValidEmail)

            await this.updateContent(session.key, email)
            await this.ctx.reply("Почта записана и обновлена на сайте!")
            return
        }
    }

    private async sendConfirmationKeyboard(key: KeyContentUpdate, message: string) {
        const keyboard = new InlineKeyboard()
            .text("Да!", `adminUpdateContentAgreement key=${key} uAnswer=true`)
            .text("Нет", `adminUpdateContentAgreement key=${key} uAnswer=false`)

        this.ctx.session.waitngFromUpdateContent[this.ctx.from.id] = {
            key,
            methodName: `handle${key.charAt(0).toUpperCase() + key.slice(1)}` as AdminContentUpdateMethodNames,
        }

        return await this.ctx.reply(message, { reply_markup: keyboard })
    }

    private async updateContent(key: string, value: string) {
        const content = await this.prisma.content.findFirst()
        await this.prisma.content.update({
            data: {
                [key]: value,
            },
            where: {
                id: content.id,
            },
        })

        delete this.ctx.session.waitngFromUpdateContent[this.ctx.from.id]
    }

    private validatePhone(phone: string): string | null {
        const cleanedPhone = phone.replace(/[^0-9+()\s-]/g, '')
        const digitCount = (cleanedPhone.match(/\d/g) || []).length
        return digitCount < 10 ? null : cleanedPhone
    }

    private validateEmail(email: string): string | null {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email) ? email : null
    }
}

export default TelegramAdminContentUpdateMsgService
