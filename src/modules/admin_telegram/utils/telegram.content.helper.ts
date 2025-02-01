import { PrismaClient, User } from "@prisma/client"
const PRISMA = new PrismaClient()

export async function getSiteContent(user: User | undefined) {
  try {
    if(!user) throw new Error()
    const site = await PRISMA.user.findUnique({
      where: {
        id: user.id,
      }, 
      include: {
        site: {
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
        }

      }
    })

    return site
  } catch (e) {
    throw e
  }
}

export async function getContent(id: number) {
  try {
    if(!id) throw new Error()
    const content = await PRISMA.content.findUnique({
      where: {
        id
      }
    })

    return content
  } catch (e) {
    throw e
  }
}