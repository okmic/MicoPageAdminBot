import dotenv from 'dotenv'
import AdminBot from "./modules/admin_telegram"

dotenv.config()

new AdminBot(process.env.TG_TOKEN).start()
