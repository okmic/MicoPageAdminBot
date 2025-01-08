export interface ProductsXLSXI {
    "Заголовок": string
    "Ссылка на изображение": string
    "Описание": string
    "Цена": number
}

export interface WorksXLSXI {
    "Заголовок": string
    "Ссылка на изображение": string
    "Описание": string
}

export interface ServicesXLSXI {
    "Заголовок": string
    "Ссылка на изображение": string
    "Описание": string
}

export interface SocialXLSXI {
    "Заголовок": string
    "Ссылка на изображение": string
    "Ссылка на социальную сеть": string
}

export type TKeysXlsxContentMassUpdate = "products" | "services" | "works" | "socialMedia"