import { Context, SessionFlavor } from "grammy"
import { ITelegramAdminContentUpdateHandleEmail, ITelegramAdminContentUpdateHandlePhone, ITelegramAdminContentUpdateHandleProducts } from "./services/content/update/types"
import { Content, SiteProducts } from "@prisma/client"

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
      products?: ITelegramAdminContentUpdateHandleProducts
    }
  }

}


export type AdminContentUpdateMethodNames = "handlePhone" | "handleEmail" | "handleProducts"

interface MyContext extends Context, SessionFlavor<SessionData> {
}

export type KeyContentUpdate = keyof Content | "someUpdate"  | "products" | "services" | "works" | "socialMidea"

export interface KeyContentUpdateWord {
    key: KeyContentUpdate
    word: string
}