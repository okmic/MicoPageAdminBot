import { PrismaClient } from '@prisma/client'
import { v4 } from 'uuid'

export default class SiteInit {
  private site: any
  private userId: number
  private prisma: PrismaClient

  constructor(userId: number) {
    this.prisma = new PrismaClient()
    this.userId = userId

    const siteHash = v4()
    this.site = {
      createdAt: new Date(),
      siteHash,
      Type: 'EJS', 
      pegesStringArray: [`${siteHash}/index.ejs`],
      userId: this.userId,
      content: this.createDefaultContent(),
    }
  }

  private createDefaultContent(): any {
    return {
      createdAt: new Date(),
      logoName: "MicoPage",
      logoImgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHPxTQOIal5YuQgMVMiS3GLf-NkkJitBRjQ&s",
      companyDescription: "Mico Page - мы занимается предоставлением высококачественных услуг в области... Мы стремимся к инновациям и качеству",
      address: "Дефолтный адрес",
      phone: "1234567890",
      email: "info@micopage.com",
      mainBlockTitle: "Mico Page 👋",
      mainBlockDescription: "Choose a template and make a website",
      mainBlockImgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHPxTQOIal5YuQgMVMiS3GLf-NkkJitBRjQ&s",
      services: [this.createDefaultService()],
      works: [this.createDefaultWork()],
      socialMedia: [this.createDefaultSocialMedia()],
      products: [this.createDefaultProduct()],
    }
  }

  private createDefaultService(): any {
    return {
      title: "Дефолтный сервис",
      items: [this.createDefaultItem()],
      imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHPxTQOIal5YuQgMVMiS3GLf-NkkJitBRjQ&s",
    }
  }

  private createDefaultItem(): any {
    return {
      text: "Дефолтный текст элемента",
    }
  }

  private createDefaultWork(): any {
    return {
      title: "Дефолтная работа",
      imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHPxTQOIal5YuQgMVMiS3GLf-NkkJitBRjQ&s",
    }
  }

  private createDefaultSocialMedia(): any {
    return {
      title: "MicoPage",
      linkToSM: "https://github.com/okmic",
      imgUrl: "/media/icons/whatsapp.png",
    }
  }

  private createDefaultProduct(): any {
    return {
      title: "MicoPage",
      imgUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHPxTQOIal5YuQgMVMiS3GLf-NkkJitBRjQ&s",
      description: "Дефолтное описание продукта",
      price: 3000,
    }
  }

  public async initDefaultSite(): Promise<any> {
    try {
      const createdSite = await this.prisma.site.create({
        data: {
          ...this.site,
          content: {
            create: this.site.content,
          },
        },
        include: {
          content: true,
        },
      })
      return createdSite
    } catch (error) {
      throw error
    }
  }

}