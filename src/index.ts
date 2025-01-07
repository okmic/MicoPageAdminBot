import dotenv from 'dotenv'
import AdminBot from "./modules/admin_telegram"
import { getPathStoroge, storageChecked } from './helper'
import ShedulesService from './modules/shedules/shedules.service'
dotenv.config()

try {
    
    const path2stor = getPathStoroge()
    storageChecked(path2stor)
    storageChecked(path2stor + "/mico-page")
    storageChecked(path2stor + "/mico-page/appfiles")
    storageChecked(path2stor + "/mico-page/img")
    storageChecked(path2stor + "/mico-page/img/telegram")
    storageChecked(path2stor + "/mico-page/img/telegram/admin")

    console.log(`MicoPageAdminBot started at ${new Date()}`)

    new AdminBot(process.env.TG_TOKEN).start()
    new ShedulesService().initShedules()
    
} catch (e) {
    console.error(`--------------------------------------------------------- ERROR AT ${new Date()} ----------------------------------------------------------------------`)
    console.error(e)
}

