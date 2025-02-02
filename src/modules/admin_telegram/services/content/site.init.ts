import { PrismaClient, Prisma, Site } from '@prisma/client'
import { v4 } from 'uuid'

export default class SiteInit {
  private site
  private content
  private prisma: PrismaClient

  constructor(userId: number, prisma: PrismaClient) {
    this.prisma = prisma

    this.site = {
      siteHash:  v4(),
      Type: 'EJS',
      pegesStringArray: [`index.ejs`],
      userId: userId,
    }
    this.content = this.createDefaultContent()
  }

  private createDefaultContent() {
    return {
      companyDescription: "Mico Page - мы занимается предоставлением высококачественных услуг в области... Мы стремимся к инновациям и качеству",
      address: "Дефолтный адрес",
      phone: "1234567890",
      email: "info@micopage.com",
      mainBlockTitle: "Mico Page 👋",
      mainBlockDescription: "Choose a template and make a website",
      mainBlockImgUrl: "https://optim.tildacdn.com/tild6633-3762-4264-b663-663065623130/-/resize/572x/-/format/webp/image.png",
      services: {
        create: [this.createDefaultService()],
      },
      works: {
        create: [this.createDefaultWork()],
      },
      socialMedia: {
        create: [this.createDefaultSocialMedia()],
      },
      products: {
        create: [this.createDefaultProduct()],
      },
    }
  }

  private createDefaultService(): Prisma.ContentServiceCreateWithoutContentInput {
    return {
      title: "Дефолтный сервис",
      items: {
        create: [this.createDefaultItem()],
      },
      imgUrl: "https://optim.tildacdn.com/tild6633-3762-4264-b663-663065623130/-/resize/572x/-/format/webp/image.png",
    }
  }

  private createDefaultItem(): Prisma.ContentItemCreateWithoutServiceInput {
    return {
      text: "Дефолтный текст элемента",
    }
  }

  private createDefaultWork(): Prisma.ContentWorkCreateWithoutContentInput {
    return {
      title: "Дефолтная работа",
      imgUrl: "https://optim.tildacdn.com/tild6633-3762-4264-b663-663065623130/-/resize/572x/-/format/webp/image.png",
    }
  }

  private createDefaultSocialMedia(): Prisma.ContentSocialMediaCreateWithoutContentInput {
    return {
      title: "MicoPage",
      linkToSM: "https://github.com/okmic",
      imgUrl: "/media/icons/whatsapp.png",
    }
  }

  private createDefaultProduct(): Prisma.SiteProductsCreateWithoutContentInput {
    return {
      title: "MicoPage",
      imgUrl: "https://optim.tildacdn.com/tild6633-3762-4264-b663-663065623130/-/resize/572x/-/format/webp/image.png",
      description: "Дефолтное описание продукта",
      price: 3000,
    }
  }

  public async initDefaultSite(): Promise<Site> {
    try {
      const content = await this.prisma.content.create({
        data: this.content
      })

      return await this.prisma.site.create({
        data: {
          ...this.site,
          contentId: content.id
        }
      })

    } catch (e) {
      throw e
    }
  }
}