import xlsx from 'xlsx'
import { ProductsXLSXI } from './types'
import { PrismaClient } from '@prisma/client'

class XlsxService {

    private prisma: PrismaClient

    constructor () {
        this.prisma = new PrismaClient()
    }

    async readXlsx(filePath: string, key: "products" | "services" | "works" | "socialMidea"): Promise<string> {
        try {

            const workbook = xlsx.readFile(filePath)
            const worksheet = workbook.Sheets[workbook.SheetNames[0]]
            const data = xlsx.utils.sheet_to_json(worksheet)
    
            switch(key) {
                case 'products': {
                    const validData = this.isValidProducts(data as ProductsXLSXI[])
                    if(validData) {
                        await this.saveProducts(data as ProductsXLSXI[])
                        return "Записал и обновил на сайте"
                    } else "Произошла ошибка при проверке данных, перепроверьте пожалуйста файл и удостоверитесь в порядке на предмет правильности заголовков и записанных в них данных"
                }
                case 'services': break
                case 'works': break
                case 'socialMidea': break
                default: throw new Error()
            }
    
            console.log()

        } catch(e) {
            return "Произошла ошибка записи, повторите попытку позже"
        }


    }


    private isValidProducts(products:ProductsXLSXI[]): boolean {
        let result = true
        for (let i = 0; i < products.length; i++) {
            if(
                !products[i]["Заголовок"] ||
                !products[i]["Описание"]  ||
                !products[i]['Ссылка на изображение']  ||
                !products[i]["Цена"]
            ) {
                result = false
                break
            }
        }
        
        return result
    }

    async saveProducts(products: ProductsXLSXI[]) {

        await this.prisma.$transaction(async (prisma) => {

            const content = await prisma.content.findFirst()

            await prisma.siteProducts.deleteMany({
                where: {
                    contentId: content.id
                }
            })

            await prisma.content.update({
                data: {
                    products: {
                        createMany: {
                            data: products.map(p => ({
                                title: p['Заголовок'],
                                imgUrl: p["Ссылка на изображение"],
                                description: p["Описание"],
                                price: p["Цена"]
                            
                            }))
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