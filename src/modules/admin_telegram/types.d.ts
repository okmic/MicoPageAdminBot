import { Context, SessionFlavor } from "grammy"
import {  ITelegramAdminContentUpdateHandleMassUpdateWithSite, ITelegramAdminContentUpdateHandleString } from "./services/content/update/types"
import { Content, Prisma, User } from "@prisma/client"
import { TKeysXlsxContentMassUpdate } from "../xlsx/types"

export type TAdminTelegramOneTurnActions =  "chooseCreateSite" | "loadSiteZip" | "addUserFtpServer" | "deployToSite"

export interface SessionData {

  storageUsersData: {
    [userId: string]: {
      user?: User 
      selectedSite?: {
        siteId: number
        contentId: number
      }
    }
  }

  userAction: {
    [userId: string]: {
      key: TAdminTelegramOneTurnActions
    }
  }

  updateContent: {
    [userId: string]: KeyContentUpdate
  }

  waitngFromUpdateContent:  {
    [userId: string]: {
      key: KeyContentUpdate
      methodName: AdminContentUpdateMethodNames

      logoName?: ITelegramAdminContentUpdateHandleString
      logoImgUrl?: ITelegramAdminContentUpdateHandleString
      createdAt?: ITelegramAdminContentUpdateHandleString
      companyDescription?: ITelegramAdminContentUpdateHandleString
      address?: ITelegramAdminContentUpdateHandleString
      phone?: ITelegramAdminContentUpdateHandleString
      email?: ITelegramAdminContentUpdateHandleString
      mainBlockTitle?: ITelegramAdminContentUpdateHandleString
      mainBlockDescription?: ITelegramAdminContentUpdateHandleString
      mainBlockImgUrl?: ITelegramAdminContentUpdateHandleString

      products?: ITelegramAdminContentUpdateHandleMassUpdateWithSite
      services?: ITelegramAdminContentUpdateHandleMassUpdateWithSite
      works?: ITelegramAdminContentUpdateHandleMassUpdateWithSite
      socialMidea?: ITelegramAdminContentUpdateHandleMassUpdateWithSite
    }
  }

}

export type AdminContentUpdateMethodNames = "handlePhone" | "handleEmail" | "handleUpdateMassFileXlsx"

interface MyContext extends Context, SessionFlavor<SessionData> {
}

export type KeyContentUpdate = keyof Content | "someUpdate"  | TKeysXlsxContentMassUpdate

export interface KeyContentUpdateWord {
    key: KeyContentUpdate
    word: string
}