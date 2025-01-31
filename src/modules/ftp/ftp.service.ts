import { FtpServer } from '@prisma/client'
import {Client} from 'basic-ftp'
import fs from 'fs/promises'
import * as path from 'path'

export default class FTPService {
    private client: Client
    private itemsToUpload: string[]
    private remoteBasePath: string
    private ftpServer: FtpServer

    constructor(itemsToUpload: string[], remoteBasePath: string, ftpServer: FtpServer) {

        this.client = new Client(6900)
        this.itemsToUpload = itemsToUpload
        this.remoteBasePath = remoteBasePath
        this.ftpServer = ftpServer

        this.client.ftp.verbose = true 
    }

    async start() {
        try {
            await this.client.access({
                host: this.ftpServer.ftpHost,
                user: this.ftpServer.ftpUser,
                password: this.ftpServer.ftpPassword,
                secure: this.ftpServer.isSecureFtp
            })
            
            await this.uploadItems()

            return "Обновил!"
        } catch (e) {
            return "Произошла ошибка загрузки, проверьте свой ftp сервер и настройки доступа к нему, хост, логин, пароль и попробуйте снова!"
        } finally {
            this.close()
        }
    
        //need to close conn
    }

    private async uploadFile(localFilePath: string, remoteFilePath: string) {
        await this.client.uploadFrom(localFilePath, remoteFilePath)
        console.log(`Uploaded ${localFilePath} to ${remoteFilePath}`)
    }

    private async uploadDirectory(localDirPath: string, remoteDirPath: string) {
        await this.client.ensureDir(remoteDirPath)
        const files = await fs.readdir(localDirPath)

        for (const file of files) {
            const localFilePath = path.join(localDirPath, file)
            const remoteFilePath = path.join(remoteDirPath, file)

            const stat = await fs.stat(localFilePath)

            if (stat.isDirectory()) {
                await this.uploadDirectory(localFilePath, remoteFilePath)
            } else {
                await this.uploadFile(localFilePath, remoteFilePath)
            }
        }
    }

    private async uploadItems() {
        for (const item of this.itemsToUpload) {
            const localPath = path.resolve(item)
            const remotePath = path.join(this.remoteBasePath, path.basename(item))

            const stat = await fs.stat(localPath)

            if (stat.isDirectory()) {
                await this.uploadDirectory(localPath, remotePath)
            } else {
                await this.uploadFile(localPath, remotePath)
            }
        }
    }

    private close() {
        this.client.close()
        console.log('Connection closed')
    }
}
