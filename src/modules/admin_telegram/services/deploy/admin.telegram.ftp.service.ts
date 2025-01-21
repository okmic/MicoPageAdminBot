import { Bot } from "grammy"
import { MyContext } from "../../types"
import { FtpServer } from "@prisma/client"

class AdminTelegramFtpService {

    async handleAddFtpUser(ctx: MyContext, bot: Bot) {
        await ctx.reply(`Пожалуйста, отправьте данные для доступа к вашему FTP серверу в одном сообщении:`)
        await ctx.reply(`хост: ваш_хост\nпользователь: ваше_имя_пользователя\nпароль: ваш_пароль\nбезопасный_ftp: да_если_ftps_или_нет_если_ftp`)
        ctx.session.userAction[ctx.from.id] = {key: "addUserFtpServer"}
        return
    }

    validateFtpCredentials(data: string): Partial<FtpServer> | null {
        const lines = data.split('\n')
        const credentials: Partial<FtpServer> = {}
    
        for (const line of lines) {

            const [key, value] = line.split(':').map(part => part.trim())

            if (!key || !value) continue
    
            switch (key) {
                case 'хост':
                    credentials.ftpHost = value
                    break
                case 'пользователь':
                    credentials.ftpUser = value
                    break
                case 'пароль':
                    credentials.ftpPassword = value
                    break
                case 'безопасный_ftp':
                    credentials.isSecureFtp = value.toLowerCase() === 'да'
                    break
            }
        }
    
        if (credentials.ftpHost && credentials.ftpUser && credentials.ftpPassword !== undefined && credentials.isSecureFtp !== undefined) {
            return credentials
        }
    
        return null
    }

}


export default new AdminTelegramFtpService()