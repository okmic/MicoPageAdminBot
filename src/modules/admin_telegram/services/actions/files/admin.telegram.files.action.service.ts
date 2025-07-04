import { Bot } from "grammy"
import { MyContext } from "../../../types"
import { PrismaClient } from "@prisma/client"
import { TKeysXlsxContentMassUpdate } from "../../../../xlsx/types"
import AdminTelegramZipService from "./admin.telegra.zip.service"
import AdminTelegramImgService from "./admin.telegra.img.service"
import AdminTelegramXlsxService from "./admin.telegra.xlsx.service"
import adminTelegramStorageController from "../../../controllers/admin.telegram.storage.controller"
import SiteInit from "../../content/site.init"

export default class AdminTelegramFilesActionService {

    bot: Bot<MyContext>

    constructor(bot) {
        this.bot = bot
    }

    handleFiles() {
        try {

            this.bot.on(':photo', async (ctx) => {
                try {
                    const resultPath = await new AdminTelegramImgService(ctx, this.bot, "jpg").saveImage()
                    return await ctx.reply(resultPath)
                } catch (e) {
                    return await ctx.reply("Произошла ошибка при сохранении изображения.")
                }
            })

            this.bot.on(':document', async (ctx) => {
                try {
                    const document = ctx.message.document

                    if (this.isImage(document.mime_type)) return await this.handleImgDocument(ctx, document)

                    else if (this.isXlsx(document.mime_type)) return await this.handleXlsxDocument(ctx)

                    else if (ctx.session.userAction[ctx.from.id] && ctx.session.userAction[ctx.from.id].key === "loadSiteZip" && document.mime_type === 'application/zip') return await this.handleZipDocument(ctx)

                    else return await ctx.reply('Неизвестное действие')

                } catch (e) {
                    console.error(e)
                    ctx.reply("Произошла ошибка при сохранении документа.")
                }
            })

        } catch (e) {
            console.error("Ошибка в обработке изображений:", e)
        }
    }

    private async handleZipDocument(ctx: MyContext) {
        const fileId = ctx.message.document.file_id

        await ctx.reply('Загружаю файл...')

        try {
            const {user} = ctx.session.storageUsersData[ctx.from.id]
            const prisma = new PrismaClient()
            const site = await new SiteInit(user.id, prisma).initDefaultSite()

            await new AdminTelegramZipService(ctx, this.bot).downloadAndExtractZip(fileId, site.siteHash)

            return await ctx.reply('Сайт загружен!')

        } catch (e) {
            console.log(e)
            await ctx.reply('Произошла ошибка при распаковке файла.')
        } finally {
            adminTelegramStorageController.userTelegramClearStorage(ctx)
        }
    }

    private async handleImgDocument(ctx: MyContext, document: Document & any) {
        const resultPath = await new AdminTelegramImgService(ctx, this.bot, document.mime_type).saveImage()
        return await ctx.reply(resultPath)
    }

    private async handleXlsxDocument(ctx: MyContext) {
        const key = ctx.session.updateContent[ctx.from.id]
        if (!key || !["products", "services", "works", "socialMidea"].includes(key)) return

        await  new AdminTelegramXlsxService(ctx, this.bot, key as TKeysXlsxContentMassUpdate).saveXlsx()

        return
    }

    isXlsx(mimeType: string): boolean {
        return (
            mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            mimeType === 'application/vnd.ms-excel'
        )
    }

    isImage(mimeType: string): boolean {
        return mimeType.startsWith('image/')
    }

   


}
