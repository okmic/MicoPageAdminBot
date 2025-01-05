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
        { word: "phone", key: "phone" }
    ]
}

export default new TelegramAdminHelper()