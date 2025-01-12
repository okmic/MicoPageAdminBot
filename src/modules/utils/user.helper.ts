import { PrismaClient } from "@prisma/client"
import { MyContext } from "../admin_telegram/types"

export async function getUserData(ctx: MyContext) {
    let session = ctx.session.storageUsersData[ctx.from.id]
    if (!session) {
        const chatId = ctx.from.id

        const prisma = new PrismaClient()

        let user = await prisma.user.findUnique({
            where: {
                adminTgChatId: chatId.toString()
            },
            include: {
                childUsers: true,
                parentUser: true
            }
        })

        //если у юзера есть родитель то берем его чат id
        if (user.parentUser) user.adminTgChatId = user.parentUser.adminTgChatId
        if(!user) throw new Error()
        session = user
    }

    return session
}