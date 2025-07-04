import { Bot, Context, session } from 'grammy'
import dotenv from 'dotenv'
import { SessionData } from './types'
import { ErrorTelegramStopExecution } from '../errors'
import AdminTelegramCommandsController from './controllers/admin.telegram.commands.controller'
import AdminTelegramActionsController from './controllers/admin.telegram.actions.controller'
import adminTelegramMiddleware from "./middleware/telegram.admin.middleware.service"
import adminTelegramInitDoMiddleware from "./middleware/telegram.admin.init.do.middleware.service"

dotenv.config()

class AdminBot {
  
  private bot: Bot<Context>

  constructor(token: string) {
    this.bot = new Bot(token)
    this.initialize()
  }

  private async initialize() {
    try {
      const initSession: SessionData = {
        storageUsersData: {},
        initDoAction: {},
        updateContent: {},
        waitngFromUpdateContent: {},
        userAction: {}
        }
  
      this.bot.use(session({
        initial: () => (initSession) 
      }))
  
      this.bot.use(adminTelegramMiddleware.authMiddleWare)
      this.bot.use(adminTelegramInitDoMiddleware.initDoMiddleWare)
      this.bot.use(adminTelegramMiddleware.updateAdminContentMiddleWare)
      this.bot.use(adminTelegramMiddleware.menuMiddleWare)
      
      await new AdminTelegramCommandsController(this.bot).handleCommands()
      await new AdminTelegramActionsController(this.bot).handleActions()

    } catch (e) {
      if (e instanceof ErrorTelegramStopExecution) console.log("executed stop")
    }
  }

  public start() {
    this.bot.start()
  }

}

export default AdminBot
