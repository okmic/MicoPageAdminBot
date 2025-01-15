import { Keyboard } from 'grammy'
import { ErrorTelegramStopExecution } from '../../errors'
import { MyContext } from '../types'
import telegramAdminContentService from './content/telegram.admin.content.service'

class AdminTelegramMenuService {

    createMainMenu() {
        return new Keyboard()
            .text('👁️ Посмотреть данные сайта')
            .text('🔄 Обновить данные')
            .row()
            .text('📤 Загрузить сайт')
            .text('📝 О боте')
            .resized()
    }

    async handleMenuSelection(ctx: MyContext) {
        const msg = ctx.message.text
        switch (msg) {
            case '📤 Загрузить сайт':
                ctx.session.oneTurnAction[ctx.from.id] = "loadSiteZip"
                await ctx.reply('Вы выбрали загрузку сайта. Пожалуйста, загрузите сайт как ZIP-файл.')
                return new ErrorTelegramStopExecution()
            case '👁️ Посмотреть данные сайта':
                await telegramAdminContentService.getContentDetailsCommand(ctx)
                return new ErrorTelegramStopExecution()
            case '🔄 Обновить данные':
                //обновляется за счет прослушки ключивых слов, в данном случе слово "Обновить"
                return
            case '📝 О боте':
                await ctx.reply('MicoPageBot TM')
                return new ErrorTelegramStopExecution()
            default:
                return
        }
    }
}

export default new AdminTelegramMenuService()
