import dotenv from 'dotenv'
import AdminBot from "./modules/admin_telegram"
import { getPath, storageChecked } from './helper'
dotenv.config()

try {
    
    const path2stor = getPath("storage")
    storageChecked(path2stor)
    storageChecked(path2stor + "/mico-page")
    storageChecked(path2stor + "/mico-page/appfiles")
    storageChecked(path2stor + "/mico-page/")
    storageChecked(path2stor + "/mico-page/telegram")
    storageChecked(path2stor + "/mico-page/telegram/admin")
    storageChecked(path2stor + "/mico-page/telegram/admin/img")

    console.log(`MicoPageAdminBot started at ${new Date()}`)

    new AdminBot(process.env.TG_TOKEN).start()
    
} catch (e) {
    console.error(`--------------------------------------------------------- ERROR AT ${new Date()} ----------------------------------------------------------------------`)
    console.error(e)
}

