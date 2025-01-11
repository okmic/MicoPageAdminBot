import { Keyboard } from "grammy"

class AdminTelegramMenuService {

     createMainMenu() {
        try {
    
            return new Keyboard()
            .text('👋 Привет')
            .text('❓ Помощь')
            .row()
            .text('⚙️ Настройки')
            .text('О боте')
            .resized()
    
        } catch (e) {
            throw e
        }
    }

}

export default new AdminTelegramMenuService()