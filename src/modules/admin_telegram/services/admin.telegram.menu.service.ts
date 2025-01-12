import { Keyboard } from 'grammy'
import { ErrorTelegramStopExecution } from '../../errors'
import { MyContext } from '../types'

class AdminTelegramMenuService {
    
    createMainMenu() {
        return new Keyboard()
            .text('📤 Загрузить сайт')
            .text('👁️ Посмотреть данные сайта')
            .row()
            .text('🔄 Обновить данные')
            .text('📝 О боте')
            .resized()
    }

    async handleMenuSelection(ctx: MyContext) {
        const msg = ctx.message.text
        console.log(msg)
        switch (msg) {
            case '📤 Загрузить сайт':
                await ctx.reply('Вы выбрали загрузку сайта. Пожалуйста, загрузите сайт как ZIP-файл.')
                ctx.session[ctx.from.id].loadSiteZip = true
                return new ErrorTelegramStopExecution()
            case '👁️ Посмотреть данные сайта':
                await ctx.reply('Здесь вы можете просмотреть данные сайта.')
                return new ErrorTelegramStopExecution()
            case '🔄 Обновить данные':
                await ctx.reply('Данные обновлены.')
                return new ErrorTelegramStopExecution()
            case '📝 О боте':
                await ctx.reply('Этот бот предназначен для загрузки сайтов и управления ими.')
                return new ErrorTelegramStopExecution()
            default:
                return
        }
    }
}

export default new AdminTelegramMenuService()
