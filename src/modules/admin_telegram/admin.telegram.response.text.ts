class AdminTelegramResponseText {
    
    public msgErrorValidPhone
    public msgErrorValidEmail

    constructor() {
        this.msgErrorValidPhone = "Пожалуйста, введите номер телефона в формате РФ:\n1. С международным кодом: +7 912 345 67 89\n2. С местным кодом: 8 (912) 345-67-89\n3. Без пробелов: 79123456789"
        this.msgErrorValidEmail = `Пожалуйста, введите ваш адрес электронной почты в формате:\nexample@example.com\n\nВажно: убедитесь, что адрес содержит символ "@" и доменное имя (например ".com", ".ru")`
    }

}

export default new AdminTelegramResponseText()