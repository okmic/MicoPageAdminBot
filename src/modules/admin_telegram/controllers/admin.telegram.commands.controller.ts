import { Bot } from "grammy"
import { MyContext } from "../types"
import { PrismaClient } from "@prisma/client"

class AdminTelegramCommandsController {

    private bot: Bot<MyContext>
    private prisma

    constructor(bot) {
        this.bot = bot
        this.prisma = new PrismaClient()
    }

    async handleCommands() {
        this.bot.command('get_statistics', async (ctx) => await this.getStatisticsCommand(ctx))
        this.bot.command('start', async (ctx) => await this.startCommand(ctx as MyContext))
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