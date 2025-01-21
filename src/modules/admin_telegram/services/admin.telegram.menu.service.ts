import { Bot, Keyboard } from "grammy"
import { ErrorTelegramStopExecution } from "../../errors"
import { MyContext } from "../types"
import telegramAdminContentService from "./content/telegram.admin.content.service"
import { telegramMenuMsgs } from "../controllers/admin.telegram.messages.controller"
import adminTelegramStorageController from "../controllers/admin.telegram.storage.controller"
import AdminTelegramFtpService from "./deploy/admin.telegram.ftp.service"

class AdminTelegramMenuService {

    createMainMenu() {
        return new Keyboard()
            .text(telegramMenuMsgs.getData)
            .text(telegramMenuMsgs.updateData)
            .row()
            .text(telegramMenuMsgs.settings)
            .text(telegramMenuMsgs.about)
            .resized()
    }

    private settingsMeny() {
        return new Keyboard()
            .row()
            .text(telegramMenuMsgs.downloadSite)
            .row()
            .text(telegramMenuMsgs.deployToFtp)
            .row()
            .text(telegramMenuMsgs.addFtpUser)
            .resized()
    }

    async handleMenuSelection(ctx: MyContext, bot: Bot) {
        const msg = ctx.message.text
        switch (msg) {
            case telegramMenuMsgs.getData:
                await telegramAdminContentService.getContentDetailsCommand(ctx)
                return new ErrorTelegramStopExecution()
            case telegramMenuMsgs.updateData:
                //обновляется за счет прослушки ключивых слов, в данном случе слово "Обновить"
                return
            case telegramMenuMsgs.settings:
                return await ctx.reply("Выберите один вариант из предложенного списка 🗂️🔍", { reply_markup: this.settingsMeny() })
            case telegramMenuMsgs.about:
                await ctx.reply("MicoPageBot TM")
                return new ErrorTelegramStopExecution()

            case telegramMenuMsgs.downloadSite:
                adminTelegramStorageController.userTelegramClearStorage(ctx)
                ctx.session.userAction[ctx.from.id] = {key: "loadSiteZip"}
                await ctx.reply("Вы выбрали загрузку сайта. Пожалуйста, загрузите сайт как ZIP-файл.")
                return new ErrorTelegramStopExecution()
            case telegramMenuMsgs.deployToFtp: {
                return await ctx.reply(ctx.msg.text)
            }
            case telegramMenuMsgs.addFtpUser: {
                return await AdminTelegramFtpService.handleAddFtpUser(ctx, bot)
            }
            default:
                return
        }
    }
}

export default new AdminTelegramMenuService()
