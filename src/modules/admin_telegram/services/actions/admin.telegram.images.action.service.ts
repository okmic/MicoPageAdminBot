import { Bot } from "grammy"
import { MyContext } from "../../types"
import fs from 'fs/promises'
import fetch from 'node-fetch'
import { getPathStoroge, storageChecked } from "../../../../helper"
import { v4 } from "uuid"

export default class AdminTelegramImagesActionService {

    bot: Bot<MyContext>

    constructor(bot) {
        this.bot = bot
    }

    handleImages() {
        try {
            this.bot.on(':photo', async (ctx) => {
                try {
                    const resultPath = await this.saveImage(ctx)
                    return await ctx.reply(resultPath)
                } catch (e) {
                    return await ctx.reply("Произошла ошибка при сохранении изображения.")
                }
            })

            this.bot.on(':document', async (ctx) => {
                try {
                    const document = ctx.message.document

                    if (this.isImage(document.mime_type)) {
                        
                        const resultPath = await this.saveImage(ctx, document.mime_type)

                        return await ctx.reply(resultPath)

                    } else {
                        ctx.reply("Этот документ не является изображением.")
                    }
                } catch (e) {
                    ctx.reply("Произошла ошибка при сохранении документа.")
                }
            })

        } catch (e) {
            console.error("Ошибка в обработке изображений:", e)
        }
    }

    isImage(mimeType: string): boolean {
        return mimeType.startsWith('image/')
    }

    async saveImage(ctx: MyContext, extension: string = "jpg") {
        const file = await ctx.getFile()

        const filePath = file.file_path

        if (filePath) {
            const parts = filePath.split('.')
            if (parts.length > 1) extension = parts.pop()
        }

        const fileName = `${v4()}.${extension}`
        const savePath = getPathStoroge("adminTelegramImages") + `/${ctx.from.id}`
        //checked dir
        await storageChecked(savePath)
        
        await this.downloadFile(file.file_path, savePath, fileName)
        const resultPath = getPathStoroge("PublicPathToTelegramImages") + `/${ctx.from.id}/${fileName}`

        return resultPath
    }
    
    async downloadFile(tgFilePath: string, savePath: string, fileName: string) {

        const url = `https://api.telegram.org/file/bot${this.bot.token}/${tgFilePath}`
        const response = await fetch(url)

        if (!response.ok) throw new Error(`Ошибка при загрузке файла: ${response.statusText}`)

        const buffer = await response.buffer()

        await fs.writeFile(savePath + `/${fileName}`, buffer)
    }
}
