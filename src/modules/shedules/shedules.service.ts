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
                '* * * * * *', async () => {
                    try {
                        const storDir = await fs.readdir(path2stor)

                        for (let sdI = 0; sdI < storDir.length; sdI++) {

                            const childDir = await fs.readdir(path2stor + '/' + storDir[sdI])

                            for (let childDirI = 0; childDirI < childDir.length; childDirI++) {
                                try {
                                    const dateInPath = childDir[childDirI].split("_")[1].split(".")[0]
                                    const [year, month, day] = dateInPath.split('-').map(Number)
                                    const fileDate = new Date(year, month - 1, day)

                                    if(this.shouldDelete(fileDate)) {
                                        await fs.rm(
                                            `${path2stor}/${storDir[sdI]}/${childDir[childDirI]}`, 
                                            {recursive: true}
                                        ) 
                                    }
                               
                                    } catch (e) {
                                    console.error(e)
                                }
                            }
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


    shouldDelete(createdAt: Date): boolean {
        const currentDate = new Date('2024-06-01')
    
        const diffInMilliseconds = currentDate.getTime() - createdAt.getTime()
        const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24)
    
        return diffInDays > 30
    }
}