import { InputFile } from "grammy";
import { TKeysXlsxContentMassUpdate } from "../../../../../xlsx/types";
import { MyContext } from "../../../../types";
import { join } from "path";

export default class TelegramAdminContentUpdateButtonsXlsxService {

    private ctx: MyContext
    private key: TKeysXlsxContentMassUpdate
    private path2temps: string

    constructor(ctx, key: TKeysXlsxContentMassUpdate) {
        this.ctx = ctx
        this.key = key
        this.path2temps = join(__dirname, "..", "..", "..", "..", "..", "..", "..", "temps")
    }


    async handleActionsXlsxContents() {
        if (this.key === "products") {
            try {
                await this.ctx.reply("Пожалуйста, отправьте мне файл в формате xlsx с продуктами. Вот пример того, как он должен выглядеть:")
                await this.ctx.replyWithDocument(new InputFile(this.path2temps + "/temp-products.xlsx"))
            } catch (e) {
                console.error(e)
            }
        } else if(this.key === "services") {
            try {
                await this.ctx.reply("Пожалуйста, отправьте мне файл в формате xlsx с услугами компании. Вот пример того, как он должен выглядеть:")
                await this.ctx.replyWithDocument(new InputFile(this.path2temps + "/temp-services.xlsx"))
            } catch (e) {
                console.error(e)
            }
        } else if(this.key === "works") {
            try {
                await this.ctx.reply("Пожалуйста, отправьте мне файл в формате xlsx с данными блока \"О работе\". Вот пример того, как он должен выглядеть:")
                await this.ctx.replyWithDocument(new InputFile(this.path2temps +  "/temp-works.xlsx"))
            } catch (e) {
                console.error(e)
            }
        } else if(this.key === "socialMedia") {
            try {
                await this.ctx.reply("Пожалуйста, отправьте мне файл в формате xlsx с данными блока \"Где нас найти\". Вот пример того, как он должен выглядеть:")
                await this.ctx.replyWithDocument(new InputFile(this.path2temps +  "/temp-social-media.xlsx"))
            } catch (e) {
                console.error(e)
            }
        }
    }

}
