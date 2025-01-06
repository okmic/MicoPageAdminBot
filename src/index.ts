import dotenv from 'dotenv'
import AdminBot from "./modules/admin_telegram"
import { storageChecked } from './helper'
dotenv.config()

try {

    storageChecked(process.env.PATH2STORAGE)
    storageChecked(process.env.PATH2STORAGE + "/img/")
    storageChecked(process.env.PATH2STORAGE + "/img/client/")

    console.log(`MicoPageAdminBot started at ${new Date()}`)

    new AdminBot(process.env.TG_TOKEN).start()
    
} catch (e) {
    console.error(`--------------------------------------------------------- ERROR AT ${new Date()} ----------------------------------------------------------------------`)
    console.error(e)
}

