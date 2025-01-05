import dotenv from 'dotenv'
import AdminBot from "./modules/admin_telegram"

dotenv.config()

try {
    new AdminBot(process.env.TG_TOKEN).start()
} catch (e) {
    console.error(`--------------------------------------------------------- ERROR AT ${new Date()} ----------------------------------------------------------------------`)
    console.error(e)
}

