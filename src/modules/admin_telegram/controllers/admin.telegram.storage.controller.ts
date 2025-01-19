import { MyContext } from "../types"

export class AdminTelegramStorageController {

    private ctx: MyContext

    constructor(ctx) {
        this.ctx = ctx
    }

    userTelegramClearStorage() {
        delete this.ctx.session.oneTurnAction[this.ctx.from.id]
        delete this.ctx.session.storageUsersData[this.ctx.from.id]
        delete this.ctx.session.updateContent[this.ctx.from.id]
        delete this.ctx.session.waitngFromUpdateContent[this.ctx.from.id]
    }

}