import { Content, PrismaClient, Site, User } from "@prisma/client"
const PRISMA = new PrismaClient()

export async function getSiteContent(userId: number, siteId: number, contentId: number): Promise<{user: User, site: Site, content: Content}> {
  try {
    if(!userId || !siteId || !contentId ) throw new Error()

      const [user, site, content] = await PRISMA.$transaction([

        PRISMA.user.findUnique({
          where: {
            id: userId,
          }
        }),

        PRISMA.site.findUnique({
            where: {
              id: siteId
            }
        }),

        PRISMA.content.findUnique({
          where: {
            id: contentId
          },
          include: {
            services: {
              include: {
                items: true
              }
            },
            works: true,
            products: true,
            socialMedia: true
          }
        })

      ])


      if(!user || !site || !content) throw new Error()

     return {user, site, content}
     
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