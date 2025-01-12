import fs from "fs/promises"
import dotenv from "dotenv"
import { join } from "path"
dotenv.config()

export async function storageChecked(dirPath: string) {
    try {
        await fs.access(dirPath)
    } catch (e) {
        await fs.mkdir(dirPath, { recursive: true })
    }
}

export type TGetPath = "storage" | "adminTelegramImages" | "PublicPathToTelegramImages" | "adminTelegramXlsx" | "systemTempsFiles"
export function getPath(storageType?: TGetPath) {
    
    const storPath = join(__dirname, "..", "..", "storage") 

    switch(storageType) {
        case "adminTelegramImages": return storPath + `/mico-page/img/telegram/admin`
        case "adminTelegramXlsx": return storPath + `/mico-page/appfiles`
        case "PublicPathToTelegramImages": return process.env.MICO_PAGE_PUBLIC_URL + `/mico-page/telegram/admin/img`
        case "systemTempsFiles": return join(__dirname, "..", "temps")
        case "storage": return storPath
        default: throw new Error("invalid key")
    }
}

