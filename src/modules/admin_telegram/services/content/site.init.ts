import { PrismaClient, Prisma, Site } from '@prisma/client'
import { v4 } from 'uuid'

export default class SiteInit {
  private site
  private content
  private prisma: PrismaClient

  constructor(userId: number, prisma: PrismaClient) {
    this.prisma = prisma

    const siteHash = v4()
    this.site = {
      siteHash,
      Type: 'EJS',
      pegesStringArray: [`${siteHash}/index.ejs`],
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
      mainBlockImgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHPxTQOIal5YuQgMVMiS3GLf-NkkJitBRjQ&s",
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
      imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHPxTQOIal5YuQgMVMiS3GLf-NkkJitBRjQ&s",
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
      imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHPxTQOIal5YuQgMVMiS3GLf-NkkJitBRjQ&s",
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
      imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHPxTQOIal5YuQgMVMiS3GLf-NkkJitBRjQ&s",
      description: "Дефолтное описание продукта",
      price: 3000,
    }
  }

  public async initDefaultSite(): Promise<Site> {
    try {
      return await this.prisma.site.create({
        data: {
          ...this.site,
          content: {
            create: this.content,
          },
        },
      })

    } catch (e) {
      throw e
    }
  }
}