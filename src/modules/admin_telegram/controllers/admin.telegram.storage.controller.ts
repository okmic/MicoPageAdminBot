import { MyContext } from "../types"

class AdminTelegramStorageController {

    userTelegramClearStorage(ctx: MyContext) {
        delete ctx.session.userAction[ctx.from.id]
        delete ctx.session.updateContent[ctx.from.id]
        delete ctx.session.waitngFromUpdateContent[ctx.from.id]
    }

}

export default new AdminTelegramStorageController()