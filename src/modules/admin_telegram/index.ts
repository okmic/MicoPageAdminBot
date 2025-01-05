import { Bot, Context, session } from 'grammy'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import telegramAdminContentService from './content/telegram.admin.content.service'
import {updateAdminContentMiddleWare} from './middleware/telegram.admin.update.content.middleware.service'
import { MyContext, SessionData } from './types'
import AdminTelegramMessageAction from './admin.telegram.message.action'
import { ErrorTelegramStopExecution } from '../errors'
import AdminTelegramButtonsAction from './admin.telegram.buttons.action'

dotenv.config()

class AdminBot {
  private bot: Bot<Context>
  private prisma: PrismaClient

  constructor(token: string) {
    this.bot = new Bot(token)
    this.prisma = new PrismaClient()
    this.initializeCommands()
  }

  private initializeCommands() {
    try {
      const initSession: SessionData = {
        updateContent: {},
        waitngFromUpdateContent: {}
      }
  
      this.bot.use(session({
        initial: () => (initSession) 
      }))
  
      this.bot.use(updateAdminContentMiddleWare)
      new AdminTelegramMessageAction(this.bot).handleMessage()
      new AdminTelegramButtonsAction(this.bot).handleButtons()
  
      this.bot.command("get_content", (ctx) => telegramAdminContentService.getContentDetailsCommand(ctx));
      this.bot.on("callback_query:data", (ctx) => telegramAdminContentService.handleCallbackQuery(ctx));
      this.bot.command('add_service', (ctx) => this.addServiceCommand(ctx))
      this.bot.command('edit_service', (ctx) => this.editServiceCommand(ctx))
      this.bot.command('delete_service', (ctx) => this.deleteServiceCommand(ctx))
      this.bot.command('get_statistics', (ctx) => this.getStatisticsCommand(ctx))
      this.bot.command('start', (ctx) => this.startCommand(ctx as MyContext))
    } catch (e) {
      if (e instanceof ErrorTelegramStopExecution) {
        console.log("executed stop")
      }
    }
  }

  private async startCommand(ctx: MyContext) {
    console.log(ctx.session)
    ctx.reply('Добро пожаловать в админку MicoPage! Вот доступные команды:\n/start - Приветствие\n/get_content - Получить контент\n/add_service - Добавить услугу\n/edit_service - Редактировать услугу\n/delete_service - Удалить услугу\n/get_statistics - Получить статистику')
  }


  private async addServiceCommand(ctx: Context) {
    const content = await this.prisma.content.findFirst()
    
    ctx.reply('Введите название услуги:')
    this.bot.on('message', async (messageCtx: Context) => {
      const serviceName = messageCtx.message?.text
      if (serviceName) {
        await this.prisma.contentService.create({
          data: {
            title: serviceName,
            contentId: content.id, 
          },
        })
        messageCtx.reply(`Услуга "${serviceName}" добавлена.`)
      }
    })
  }

  private async editServiceCommand(ctx: Context) {
    ctx.reply('Введите ID услуги, которую хотите редактировать:')
    this.bot.on('message', async (messageCtx: Context) => {
      const serviceId = parseInt(messageCtx.message?.text || '')
      const service = await this.prisma.contentService.findUnique({ where: { id: serviceId } })
      if (service) {
        messageCtx.reply(`Введите новое название для услуги "${service.title}":`)
        this.bot.on('message', async (newMessageCtx: Context) => {
          const newServiceName = newMessageCtx.message?.text
          if (newServiceName) {
            await this.prisma.contentService.update({
              where: { id: serviceId },
              data: { title: newServiceName },
            })
            newMessageCtx.reply(`Услуга обновлена на "${newServiceName}".`)
          }
        })
      } else {
        messageCtx.reply('Услуга не найдена.')
      }
    })
  }

  private async deleteServiceCommand(ctx: Context) {
    ctx.reply('Введите ID услуги, которую хотите удалить:')
    this.bot.on('message', async (messageCtx: Context) => {
      const serviceId = parseInt(messageCtx.message?.text || '')
      await this.prisma.contentService.delete({ where: { id: serviceId } })
      messageCtx.reply('Услуга удалена.')
    })
  }

  private async getStatisticsCommand(ctx: Context) {
    const visits = await this.prisma.visit.count()
    ctx.reply(`Общее количество посещений: ${visits}`)
  }

  public start() {
    this.bot.start()
  }
}

export default AdminBot
