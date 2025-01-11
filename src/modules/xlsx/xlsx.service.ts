import xlsx from 'xlsx'
import { ProductsXLSXI, ServicesXLSXI, SocialXLSXI, TKeysXlsxContentMassUpdate, WorksXLSXI } from './types'
import { PrismaClient } from '@prisma/client'
import { rm } from 'fs/promises'

class XlsxService {
    
    private prisma: PrismaClient
    private successMsg
    private errorMsg

    constructor () {
        this.prisma = new PrismaClient()
        this.successMsg = "Записал и обновил на сайте"
        this.errorMsg = "Произошла ошибка при проверке данных, перепроверьте пожалуйста файл и удостоверитесь в порядке на предмет правильности заголовков и записанных в них данных"
    }

    async readXlsx(filePath: string, key: TKeysXlsxContentMassUpdate): Promise<string> {
        try {

            const workbook = xlsx.readFile(filePath)
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const data = xlsx.utils.sheet_to_json(worksheet)
    
            switch(key) {
                case 'products': {
                    const isValidProducts = this.isValidProducts(data as ProductsXLSXI[])
                    if(isValidProducts) {
                        await this.saveContent(data as ProductsXLSXI[], "products")
                        return this.successMsg
                    } else return this.errorMsg
                }
                case 'works': {
                    const isValidWorks = this.isValidWorks(data as WorksXLSXI[])
                    if(isValidWorks) {
                        await this.saveContent(data as WorksXLSXI[], "works")
                        return this.successMsg
                    } else return this.errorMsg
                }
                case 'services': {
                    const isValidServices = this.isValidService(data as ServicesXLSXI[])
                    if(isValidServices) {
                        await this.saveContent(data as ServicesXLSXI[], "services")
                        return this.successMsg
                    } else return this.errorMsg
                }
                case 'socialMedia': {
                    const isValidSocialMedia = this.isValidSocialMedia(data as SocialXLSXI[])
                    if(isValidSocialMedia) {
                        await this.saveContent(data as SocialXLSXI[], "socialMedia")
                        return this.successMsg
                    } else return this.errorMsg
                }
                default: throw new Error()
            }
    
        } catch(e) {
            return "Произошла ошибка записи, повторите попытку позже"
        } finally {
            try {
                await rm(filePath, {recursive: true})
            } catch (e) {
                console.error(e)
            }
        }
    }

    private isValidData<T>(items: T[], requiredFields: (keyof T)[]): boolean {
        for (let i = 0; i < items.length; i++) {
            for (const field of requiredFields) {
                if (!items[i][field]) {
                    return false
                }
            }
        }
        return true
    }
    
    private isValidWorks(works: WorksXLSXI[]): boolean {
        return this.isValidData(works, ["Заголовок", "Описание", "Ссылка на изображение"]);
    }
    
    private isValidService(services: ServicesXLSXI[]): boolean {
        return this.isValidData(services, ["Заголовок", "Описание"]);
    }
    
    private isValidProducts(products: ProductsXLSXI[]): boolean {
        return this.isValidData(products, ["Заголовок", "Описание", "Ссылка на изображение", "Цена"]);
    }

    private isValidSocialMedia(products: SocialXLSXI[]): boolean {
        return this.isValidData(products, ["Заголовок", "Ссылка на изображение", "Ссылка на социальную сеть"]);
    }

    async saveContent<T>(items: T[], type: TKeysXlsxContentMassUpdate) {
        await this.prisma.$transaction(async (prisma) => {
            const content = await prisma.content.findFirst()
    
            if (type === 'works') {
                await prisma.contentWork.deleteMany({
                    where: {
                        contentId: content.id
                    }
                });
            } else if (type === 'services') {
                await prisma.contentService.deleteMany({
                    where: {
                        contentId: content.id
                    }
                })
            } else if (type === 'products') {
                await prisma.siteProducts.deleteMany({
                    where: {
                        contentId: content.id
                    }
                })
            } else if (type === 'socialMedia') {
                await prisma.contentSocialMedia.deleteMany({
                    where: {
                        contentId: content.id
                    }
                })
            }
    
            const createData = items.map(item => {
                if (type === 'works') {
                    return {
                        title: item['Заголовок'],
                        imgUrl: item["Ссылка на изображение"],
                        description: item["Описание"]
                    }
                } else if (type === 'services') {
                    return {
                        title: item['Заголовок'],
                        description: item["Описание"]
                    }
                } else if (type === 'products') {
                    return {
                        title: item['Заголовок'],
                        imgUrl: item["Ссылка на изображение"],
                        description: item["Описание"],
                        price: item["Цена"]
                    }
                } else if (type === 'socialMedia') {
                    return {
                        title: item['Заголовок'],
                        imgUrl: item["Ссылка на изображение"],
                        linkToSM: item["Ссылка на социальную сеть"],
                        price: item["Цена"]
                    }
                }
            })
    
            await prisma.content.update({
                data: {
                    [type]: {
                        createMany: {
                            data: createData
                        }
                    }
                },
                where: {
                    id: content.id
                }
            })
        })
    }
    
}

export default new XlsxService()