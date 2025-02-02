import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

class MicoPageApiService {

    async buildEjsSite(payload: {
        "entryPointPathsToPages": string[],
        "exitPointPathToDeploy": string,
        "entryPointPath": string
        "contentId": number
        "ftpServerId": number
    }) {
        try {
            return await axios.post<{ status: string, values: { msg: boolean } }>(
                process.env.API_URL_MICOPAGE + `/api/mico-page/generate/ejs`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "secret": process.env.API_SECRET_MICOPAGE 
                    }
                }
            )
            .then(r => r.data.values.msg)
        } catch(e) {
            throw e
        }
    }

}

export default new MicoPageApiService()