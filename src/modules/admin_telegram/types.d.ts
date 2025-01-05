import { Context, SessionFlavor } from "grammy"
import { ITelegramAdminContentUpdateHandleEmail, ITelegramAdminContentUpdateHandlePhone } from "./content/update/types"

export interface SessionData {

  updateContent: {
    [userId: string]: KeyContentUpdate
  }

  waitngFromUpdateContent:  {
    [userId: string]: {
      key: KeyContentUpdate
      methodName: AdminContentUpdateMethodNames
      phone?: ITelegramAdminContentUpdateHandlePhone
      email?: ITelegramAdminContentUpdateHandleEmail
    }
  }

}


export type AdminContentUpdateMethodNames = "handlePhone" | "handleEmail"

interface MyContext extends Context, SessionFlavor<SessionData> {
}

export type WordContentUpdate = "someUpdate" | "обновить" | "обнови" | "update" | "email" | "почта" | "почту" | "телефон" | "phone"
export type KeyContentUpdate = "someUpdate" | "email" | "phone"

export interface KeyContentUpdateWord {
    key: KeyContentUpdate
    word: WordContentUpdate
}