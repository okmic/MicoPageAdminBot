import { Bot } from "grammy"
import { MyContext } from "../types"
import { PrismaClient } from "@prisma/client"
import telegramAdminContentService from "../services/content/telegram.admin.content.service"

class AdminTelegramCommandsController {

    private bot: Bot<MyContext>
    private prisma: PrismaClient

    constructor(bot) {
        this.bot = bot
        this.prisma = new PrismaClient()
    }

    async handleCommands() {
        this.bot.command('start', async (ctx) => await this.startCommand(ctx as MyContext))
        this.bot.command('get-content', async (ctx) => await telegramAdminContentService.getContentDetailsCommand(ctx))
        this.bot.command('load-site', async (ctx) => await this.loadSiteCommand(ctx))
    }

    private async loadSiteCommand(ctx: MyContext) {
        ctx.session.oneTurnAction[ctx.from.id] = "loadSiteZip"
        return await ctx.reply('Пожалуйста, загрузите ZIP-файл.')
    }

    private async startCommand(ctx: MyContext) {
        try {
            const findeUsersWithId = await this.prisma.user.findUnique({where: {adminTgChatId: ctx.from.id.toString()}})
            if(!findeUsersWithId) await this.prisma.user.create({
                data: {
                    adminTgChatId: ctx.from.id.toString()
                }
            })
            return await ctx.reply('Добро пожаловать в MicoPage Bot!\n\n')
        } catch (e) {
            console.error(e)
        }
    }

    private async getStatisticsCommand(ctx: MyContext) {
        const visits = await this.prisma.visit.count()
        await ctx.reply(`Общее количество посещений: ${visits}`)
    }
}

export default AdminTelegramCommandsController