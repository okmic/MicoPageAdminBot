import { KeyContentUpdateWord } from "./types";

class TelegramAdminHelper {

    keysUpdateWords: KeyContentUpdateWord[] = [
        { word: "обновить", key: "someUpdate" },
        { word: "обнови", key: "someUpdate" },
        { word: "update", key: "someUpdate" },
        { word: "email", key: "email" },
        { word: "почта", key: "email" },
        { word: "почту", key: "email" },
        { word: "телефон", key: "phone" },
        { word: "phone", key: "phone" },
        { word: "продукт", key: "products" },
        { word: "продукты", key: "products" },
        { word: "товары", key: "products" },
        { word: "phone", key: "phone" },
        { word: "листинг", key: "products" },
        { word: "products", key: "products" },
        { word: "product", key: "products" },
    ]
}

export default new TelegramAdminHelper()