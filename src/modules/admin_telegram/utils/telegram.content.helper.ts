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
        content: {
          include: {
            products: true,
            services: true,
            socialMedia: true,
            works: true
          }
        }
      }
    })

    return content.content[0]
  } catch (e) {
    throw e
  }
}