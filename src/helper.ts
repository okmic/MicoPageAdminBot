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

export function getPathStoroge(storageType?: "adminTelegramImages" | "PublicPathToTelegramImages") {
    
    const storPath = join(__dirname, "..", "..", "storage") 

    switch(storageType) {
        case "adminTelegramImages": return storPath + `/mico-page/img/telegram/admin`
        case "PublicPathToTelegramImages": return process.env.MICO_PAGE_PUBLIC_URL + `/mico-page/img/telegram/admin`
        default: return storPath
    }
}