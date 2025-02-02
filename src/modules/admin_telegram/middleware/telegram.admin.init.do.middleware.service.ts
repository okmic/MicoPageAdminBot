import { NextFunction } from "grammy"
import { MyContext } from "../types"
import { handlerChooseCreateSiteMiddleware } from "./utils/telegram.admin.middleware.utils"

class AdminTelegramInitDoMiddleware {

    async initDoMiddleWare(ctx: MyContext, next: NextFunction) {
        try {
            await handlerChooseCreateSiteMiddleware(ctx, next)
        } catch (e) {
            console.error(e)
            return
        }
    }




}

export default new AdminTelegramInitDoMiddleware()