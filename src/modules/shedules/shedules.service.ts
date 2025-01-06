import schedule from "node-schedule"
import { getPathStoroge } from "../../helper"
import fs from "fs/promises"

export default class ShedulesService {

    async initShedules() {
        try {
            await this.garbageСollectorAdminTelegramFiles()
        } catch (e) {
            console.error(e)
        }
    }
    
    private async garbageСollectorAdminTelegramFiles() {
        
        const path2stor = getPathStoroge("adminTelegramImages")
        
         schedule.scheduleJob(
                '0 0 0 * * *', async () => {
                    try {
                        const dirs = await fs.readdir(path2stor)
                        for (let i = 0; i < dirs.length; i++) {
                             await fs.rmdir(path2stor + `/${dirs[i]}`, {recursive: true})
                        }
                        console.log(`shedule executed garbageСollectorAdminTelegramFiles at ${new Date()}`)
                    } catch (e) {
                        console.log(`ERROR shedule ERROR garbageСollectorAdminTelegramFiles at ${new Date()}`)
                        console.error(e)
                    }
            }
        )

        console.log(`shedule initialized garbageСollectorAdminTelegramFiles at ${new Date()}`)
    }

}