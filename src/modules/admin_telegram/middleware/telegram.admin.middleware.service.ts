import { NextFunction } from "grammy"
import { KeyContentUpdate, KeyContentUpdateWord, MyContext } from "../types"
import TelegramAdminHelper from "../helper"
import adminTelegramMenuService from "../services/admin.telegram.menu.service"

class AdminTelegramMiddleware {

    async updateAdminContentMiddleWare(ctx: MyContext, next: NextFunction) {
        try {
            const keysUpdateWords: KeyContentUpdateWord[] = TelegramAdminHelper.keysUpdateWords
    
            if (!ctx.message || !ctx.message.text) return await next()
    
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
                const msg = ctx.message.text.toLowerCase()
                if(
                    /\/help/.test(msg) ||
                    /помощь/.test(msg) ||
                    /help/.test(msg) ||
                    /\/menu/.test(msg) ||
                    /menu/.test(msg) ||
                    /\/меню/.test(msg) ||
                    /меню/.test(msg) ||
                    /menu/.test(msg) 
                )
                return await ctx.reply('Вы можете выбрать опцию:', {
                    reply_markup: adminTelegramMenuService.createMainMenu()
                }) 
            } else return await next()
        } catch (e) {
            return
        }
    }

}

export default new AdminTelegramMiddleware()