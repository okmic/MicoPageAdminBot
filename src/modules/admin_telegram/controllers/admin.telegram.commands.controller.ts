import { Bot } from "grammy"
import { MyContext } from "../types"
import { PrismaClient } from "@prisma/client"
import telegramAdminContentService from "../services/content/telegram.admin.content.service"

class AdminTelegramCommandsController {

    private bot: Bot<MyContext>
    private prisma

    constructor(bot) {
        this.bot = bot
        this.prisma = new PrismaClient()
    }

    async handleCommands() {
        this.bot.command('start', async (ctx) => await this.startCommand(ctx as MyContext))
        this.bot.command('get_content', async (ctx) => await telegramAdminContentService.getContentDetailsCommand(ctx))
        this.bot.command('load-site', async (ctx) => await this.loadSiteCommand(ctx))
    }
    private async loadSiteCommand(ctx: MyContext) {
        ctx.session.oneTurnAction[ctx.from.id] = "loadSiteZip"
        return await ctx.reply('Пожалуйста, загрузите ZIP-файл.')
      }

    private async startCommand(ctx: MyContext) {
        await ctx.reply('Добро пожаловать в админку MicoPage! Вот доступные команды:\n/start - Приветствие\n/get_content - Получить контент\n/add_service - Добавить услугу\n/edit_service - Редактировать услугу\n/delete_service - Удалить услугу\n/get_statistics - Получить статистику')
    }

    private async getStatisticsCommand(ctx: MyContext) {
        const visits = await this.prisma.visit.count()
        await ctx.reply(`Общее количество посещений: ${visits}`)
    }
}

export default AdminTelegramCommandsController