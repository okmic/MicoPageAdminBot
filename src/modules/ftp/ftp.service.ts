import { FtpServer } from '@prisma/client'
import { Client } from 'basic-ftp'
import fs from 'fs/promises'
import * as path from 'path'

export class FTPService {
    private client: Client
    private itemsToUpload: string[]
    private remoteBasePath: string
    private ftpServer: FtpServer

    constructor(itemsToUpload: string[], remoteBasePath: string, ftpServer: FtpServer) {
        this.client = new Client()
        this.itemsToUpload = itemsToUpload
        this.remoteBasePath = remoteBasePath
        this.ftpServer = ftpServer
    }

    async connect() {
        await this.client.access({
            host: this.ftpServer.ftpHost,
            user: this.ftpServer.ftpUser ,
            password: this.ftpServer.ftpPassword,
            secure: this.ftpServer.isSecureFtp
        })
        console.log('Connected to FTP server')
    }

    async uploadFile(localFilePath: string, remoteFilePath: string) {
        await this.client.uploadFrom(localFilePath, remoteFilePath)
        console.log(`Uploaded ${localFilePath} to ${remoteFilePath}`)
    }

    async uploadDirectory(localDirPath: string, remoteDirPath: string) {
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

    async uploadItems() {
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

    async close() {
        await this.client.close()
        console.log('Connection closed')
    }
}
