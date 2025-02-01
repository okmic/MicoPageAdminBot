import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

class MicoPageApiService {

    async buildEjsSite(payload: {
        "entryPointPathsToPages": string[],
        "exitPointPathToDeploy": string,
        "contentId": number
    }) {
        try {
            await axios.post(
                process.env.API_URL_MICOPAGE + `/api/mico-page/generate/ejs`,
                payload,
                {headers: {
                    "Content-Type": "application/json",
                    "secret": process.env.API_SECRET_MICOPAGE 
                }}
            )
        } catch(e) {
            throw e
        }
    }

}

export default new MicoPageApiService()