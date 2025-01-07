import { Bot } from "grammy"
import { KeyContentUpdate, MyContext } from "../../types"
import fs from 'fs/promises'
import fetch from 'node-fetch'
import { getPathStoroge, storageChecked } from "../../../../helper"
import { v4 } from "uuid"
import xlsxService from "../../../xlsx/xlsx.service"

export default class AdminTelegramFilesActionService {

    bot: Bot<MyContext>

    constructor(bot) {
        this.bot = bot
    }

    handleFiles() {
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

                    } else if (this.isXlsx(document.mime_type)) {

                        const key = ctx.session.updateContent[ctx.from.id]
                        if(!key || !["products", "services", "works", "socialMidea"].includes(key)) return
                           
                        await this.saveXlsx(ctx, key as "products" | "services" | "works" | "socialMidea")


                        return
                    } else {
                        await ctx.reply('Неизвестный формат файла')
                    }
                } catch (e) {
                    ctx.reply("Произошла ошибка при сохранении документа.")
                }
            })

        } catch (e) {
            console.error("Ошибка в обработке изображений:", e)
        }
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

    async saveImage(ctx: MyContext, extension: string = "jpg") {
        const file = await ctx.getFile()

        const filePath = file.file_path

        if (filePath) {
            const parts = filePath.split('.')
            if (parts.length > 1) extension = parts.pop()
        }

        const fileName = `${v4()}_${this.formatDate(new Date("2024-05-01"))}.${extension}`
        const savePath = getPathStoroge("adminTelegramImages") + `/${ctx.from.id}`
        //checked dir
        await storageChecked(savePath)
        
        await this.downloadFile(file.file_path, savePath, fileName)
        const resultPath = getPathStoroge("PublicPathToTelegramImages") + `/${ctx.from.id}/${fileName}`

        return resultPath
    }

    async saveXlsx(ctx: MyContext, key: "products" | "services" | "works" | "socialMidea") {
        try {
            const file = await ctx.getFile()
            
            const fileName = `${v4()}_${this.formatDate(new Date("2024-05-01"))}.xlsx`
            const savePath = getPathStoroge("adminTelegramXlsx") + `/${ctx.from.id}`
            await storageChecked(savePath)
            
            await this.downloadFile(file.file_path, savePath, fileName)
    
            const result = await xlsxService.readXlsx(savePath + `/${fileName}`, key)
            
            return await ctx.reply(result)
        } catch (e) {
            console.error(e)
        }
    }
    
    async downloadFile(tgFilePath: string, savePath: string, fileName: string) {

        const url = `https://api.telegram.org/file/bot${this.bot.token}/${tgFilePath}`
        const response = await fetch(url)

        if (!response.ok) throw new Error(`Ошибка при загрузке файла: ${response.statusText}`)

        const buffer = await response.buffer()

        await fs.writeFile(savePath + `/${fileName}`, buffer)
    }

    private  formatDate(date: Date): string {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
    
        return `${year}-${month}-${day}`
    }
}
