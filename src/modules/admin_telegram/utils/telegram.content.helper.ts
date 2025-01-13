import { PrismaClient, User } from "@prisma/client"

export async function getSiteContent(user: User | undefined) {
  try {
    if(!user) throw new Error()
    const PRISMA = new PrismaClient()

    const content = await PRISMA.user.findUnique({
      where: {
        id: user.id,
      }, 
      include: {
        content: true
      }
    })

    return content.content
  } catch (e) {
    throw e
  }
}