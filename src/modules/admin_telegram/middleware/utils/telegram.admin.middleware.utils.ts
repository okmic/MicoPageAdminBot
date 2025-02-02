import { InlineKeyboard, NextFunction } from "grammy"
import { MyContext } from "../../types"
import { PrismaClient } from "@prisma/client"
import { universalMsgs } from "../../controllers/admin.telegram.messages.controller"

export const handlerChooseCreateSiteMiddleware = async (ctx: MyContext, next: NextFunction) => {

    if(ctx.message?.text && ctx.message.text === "/load-site") return await next()
    if(ctx.session.userAction[ctx.from.id] && ctx.session.userAction[ctx.from.id].key === "loadSiteZip") return await next()   
        
    const { selectedSite, user } = ctx.session.storageUsersData[ctx.from.id]
    const initDoAction = ctx.session.initDoAction[ctx.from.id]
    const buttonHandle = ctx.callbackQuery?.data

    if(buttonHandle && /chooseCreateSite/.test(buttonHandle)) {
        const [key, siteId, contentId] = buttonHandle.split(" ")

        ctx.session.storageUsersData[ctx.from.id].selectedSite = {siteId: Number(siteId), contentId: Number(contentId)}
        delete ctx.session.initDoAction[ctx.from.id]

        return await ctx.reply(universalMsgs.helloInitMsgHTML, {parse_mode: "HTML"})
    }
    else if(initDoAction && initDoAction.key === "chooseCreateSite" || !selectedSite) {
        const PRISMA = new PrismaClient()
        const sites = await PRISMA.site.findMany({
            where: {
                userId: user.id
            }
        })
        if (!sites || sites.length === 0) return await ctx.reply(universalMsgs.notSitesInitMsg)

        const keyboards = new InlineKeyboard()
        sites.forEach(s => keyboards.text(s.name, `chooseCreateSite ${s.id} ${s.contentId} `))

        await ctx.reply("Выберите сайт и мы продолжим", { reply_markup: keyboards })

    } else return await next()
}