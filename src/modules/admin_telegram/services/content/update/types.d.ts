export interface ITelegramAdminContentUpdateHandlePhone {
    phoneNumber?: string
    startAgreement: boolean
}

export interface ITelegramAdminContentUpdateHandleEmail {
    email?: string
    startAgreement: boolean
}

export interface ITelegramAdminContentUpdateHandleProducts {
    startAgreement: boolean
    fileDownloaded: boolean
}