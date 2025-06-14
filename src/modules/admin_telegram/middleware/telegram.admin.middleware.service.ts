import { NextFunction } from "grammy"
import { KeyContentUpdate, KeyContentUpdateWord, MyContext } from "../types"
import adminTelegramMenuService from "../services/admin.telegram.menu.service"
import { PrismaClient } from "@prisma/client"
import telegramExecuteWordsHelper from "../utils/telegram.execute.words.helper"
import { getAllWordExceptions, telegramMenuMsgs } from "../controllers/admin.telegram.messages.controller"

class AdminTelegramMiddleware {

    async authMiddleWare(ctx: MyContext, next: NextFunction) {
        try {
            if(ctx.message && ctx.message.text && ctx.message.text === "/start") return await next()

            const chatId = ctx.from.id

            const prisma = new PrismaClient()

            let user = await prisma.user.findUnique({
                where: {
                    adminTgChatId: chatId.toString()
                },
                include: {
                    childUsers: true,
                    parentUser: true,
                    site: true,
                    ftpServers: true
                }
            })

            //если у юзера есть родитель то берем его чат id
            if(user.parentUser) user.id = user.parentUser.id
            if(user.parentUser) user.isDisabled = user.parentUser.isDisabled
            if(user.parentUser) user.adminTgChatId = user.parentUser.adminTgChatId

            let isAuth = false
            if(user && user.TariffStatus !== "FREE") isAuth = true

            if(!isAuth) return await ctx.reply(`Доброго времени суток ${ctx.from.first_name}\n\nК сожалению, ваша подписка не активна. Для активации доступа к боту, пожалуйста, обратитесь к менеджеру продукта в Telegram: @MicoDevProd\n\n\nС уважением,\nКоманда поддержки MicoPage`)
            else {
                if(!ctx.session.storageUsersData[ctx.from.id] || !ctx.session.storageUsersData[ctx.from.id].user || !ctx.session.storageUsersData[ctx.from.id].selectedSite) {
                    ctx.session.storageUsersData[ctx.from.id] = {user}
                    ctx.session.initDoAction[ctx.from.id] = {key: "chooseCreateSite"}
                }
                return await next()
            }

        } catch (e) {
            return
        }
    }

    async updateAdminContentMiddleWare(ctx: MyContext, next: NextFunction) {
        try {
            if (!ctx.message || !ctx.message.text) return await next()
            const excWords = getAllWordExceptions() 

            if(excWords.includes(ctx.message.text) && ctx.message.text !== telegramMenuMsgs.updateData) return await next()
            const keysUpdateWords: KeyContentUpdateWord[] = telegramExecuteWordsHelper.keysUpdateWords
    
            const text = ctx.message.text.toLocaleLowerCase()
            
            let savedKey
    
            for (const kuw of keysUpdateWords) {
                const regExp = new RegExp(kuw.word)
                if (regExp.test(text)) {
                    if (kuw.key === "someUpdate") savedKey = "someUpdate"
                    else savedKey = kuw.key
                }
            }
            if(savedKey) ctx.session.updateContent[ctx.from.id] = savedKey as KeyContentUpdate    
            else ctx.session.updateContent[ctx.from.id] = undefined
    
            return await next()
        } catch (e) {
            return
        }
    }

    async menuMiddleWare(ctx: MyContext, next: NextFunction) {
        try {
            if (ctx.message && ctx.message.text) {
                const msg = ctx.message.text.toLowerCase().trim()
                
                if(
                    "/help" === msg ||
                    "help" === msg ||
                    "помощь" === msg ||
                    "/menu" === msg ||
                    "menu" === msg ||
                    "/меню" === msg ||
                    "меню" === msg
                ) {
                    return await ctx.reply(
                        'Вы можете выбрать опцию:', {
                            reply_markup: adminTelegramMenuService.createMainMenu()
                        }
                    ) 
                } else return await next()
           
            } else return await next()
        } catch (e) {
            return
        }
    }

/*     
    async actionMiddleWare(ctx: MyContext, next: NextFunction) {
        try {
            if(ctx.session.userAction[ctx.from.id]) return
            const action = ctx.session.userAction[ctx.from.id].key

            switch(action) {}
        } catch(e) {
            return
        }
    } 
*/

}

export default new AdminTelegramMiddleware()