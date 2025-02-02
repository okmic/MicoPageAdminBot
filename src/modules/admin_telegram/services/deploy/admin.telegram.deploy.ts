import { ErrorTelegramStopExecution } from "../../../errors"
import micoPageApiService from "../../../api/mico.page.api"
import { universalMsgs } from "../../controllers/admin.telegram.messages.controller";
import { MyContext } from "../../types";
import { getSiteContent } from "../../utils/telegram.content.helper"
import { getPath, storageChecked } from "../../../../helper";

export default class AdminTelegramDeployByButton {

    private ctx: MyContext

    constructor(ctx: MyContext) {
        this.ctx = ctx
    }

    async handle() {

        const cbData = this.ctx.callbackQuery?.data
        if(!cbData) return await this.ctx.reply(universalMsgs.defaultErrorMsg)
        const [keyCbData, ftpserverId] = cbData.split(" ")


        const {user, selectedSite} = this.ctx.session.storageUsersData[this.ctx.from.id]
        const userData = await getSiteContent(user.id, selectedSite.siteId, selectedSite.contentId)

        if (!userData || !userData.user || !userData.site || !userData.content) {
            return await this.ctx.reply(universalMsgs.defaultErrorMsg)
        }

        
        new Promise(async (res, rej) => {
            const path2storage = getPath("storage") + `/${this.ctx.from.id}/mico-page/${userData.site.siteHash}`
            const path2deploy =  getPath("storage") + `/${this.ctx.from.id}/mico-page/deploy/${userData.site.siteHash}`

            storageChecked(path2deploy)
            const entryPointPathsToPages = userData.site.pegesStringArray as string[]
            try {
                const result = await micoPageApiService.buildEjsSite({
                    contentId: userData.content.id,
                    entryPointPathsToPages: entryPointPathsToPages.map(ps => path2storage + `/` + ps as string) as string[],
                    entryPointPath: path2storage,
                    exitPointPathToDeploy: path2deploy,
                    ftpServerId: Number(ftpserverId)
                })
                console.log(result)

            } catch (e) {
                return await this.ctx.reply("Ошибка при сборке проекта!")
            } 
            
            await this.ctx.reply("Начинаю сборку проекта...")
            return res(true)
        })
        .then(async res => {
            await this.ctx.reply("Подключение к ftp серверу...")
            return
        })
        .then(async res => {
             await this.ctx.reply("Развертывание на ftp сервере...")
             return
        })
        .then(async res => {
            await this.ctx.reply("Все прошло успешно, сайт обновлен!")
            return 
        })

        /*      const resultDeploy = await new FTPService() */
        

        throw new ErrorTelegramStopExecution()

    }
}