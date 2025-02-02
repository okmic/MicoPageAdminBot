import { Bot, InlineKeyboard } from "grammy"
import { MyContext } from "../../types"
import TelegramAdminContentUpdateMsgService from "../content/update/telegram.admin.content.update.msg.service"
import adminTelegramMenuService from "../admin.telegram.menu.service"
import { ErrorTelegramStopExecution } from "../../../errors"
import adminTelegramFtpService from "../deploy/admin.telegram.ftp.service"
import { PrismaClient, User } from "@prisma/client"

export default class AdminTelegramMessageActionService {

    bot: Bot<MyContext>
    errorWriteFtpValidMsg 
    successWriteFtpValidMsg 

    constructor(bot) {
        this.errorWriteFtpValidMsg = 'Некорректный формат данных. Пожалуйста, отправь данные в правильном формате.'
        this.successWriteFtpValidMsg = 'Записал!'
        this.bot = bot
    }

    async handleMessage() {
        try {

            this.bot.on("msg", async (ctx, next) => {
                await adminTelegramMenuService.handleMenuSelection(ctx, this.bot)
                await this.handleStorageAction(ctx)
                await new TelegramAdminContentUpdateMsgService(ctx, next).handleMsgUpdates()

            })

        } catch (e) {
            if(e instanceof ErrorTelegramStopExecution) return
            console.error(e)
        }
    }

    async handleStorageAction(ctx: MyContext): Promise<void> {
        try {
            if(ctx.session.userAction[ctx.from.id]) return
            const key = ctx.session.userAction[ctx.from.id].key

            switch (key) {
                case "chooseCreateSite": {
                    const user = ctx.session.storageUsersData[ctx.from.id].user
                    if(!user) return
                    const PRISMA = new PrismaClient()
                    const sites = await PRISMA.site.findMany({
                        where: {
                            userId: user.id
                        }
                    })
                    if(!sites || sites.length === 0) return
                    
                    const keyboards = new InlineKeyboard()
                    sites.forEach(s => keyboards.text(s.name, `chooseCreateSite id=${s.id}`))

                    await ctx.reply("Выберите сайт и мы продолжим", {reply_markup: keyboards})

                    break
                }
                case "loadSiteZip":
                    if(ctx.message.text) {
                        await ctx.reply("Мне нужен zip файл в котором находится твой сайт")
                        throw new ErrorTelegramStopExecution()
                    }
                    break
                case "addUserFtpServer":
                    const msg = ctx.message.text
                    console.log(msg)
                    if (!msg || adminTelegramFtpService.validateFtpCredentials(msg)) {
                        await ctx.reply(this.errorWriteFtpValidMsg)
                        return
                    }
                    await ctx.reply(this.successWriteFtpValidMsg)
                    throw new ErrorTelegramStopExecution()
                default:
                    break
            }

        } catch (e) {
            return
        }
    }

}