import AdminTelegramZipService from "../services/actions/files/admin.telegra.zip.service"
import { MyContext } from "../types"

class AdminTelegramStorageController {

    userTelegramClearStorage(ctx: MyContext) {
        delete ctx.session.userAction[ctx.from.id]
        delete ctx.session.updateContent[ctx.from.id]
        delete ctx.session.waitngFromUpdateContent[ctx.from.id]
    }


    async handleAction(ctx: MyContext) {
        if(!ctx.session[ctx.from.id]) return
        const action = ctx.session.userAction[ctx.from.id]
        try {
            switch(action.key) {
                case "loadSiteZip":
                    await ctx.reply("Необходим файл")
                    return
                case "addUserFtpServer": 
                    ctx.reply("ist addUserFtpServer")
                default: break
            }
        } catch (e) {
            return
        } 
    }

}

export default new AdminTelegramStorageController()