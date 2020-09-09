import { http } from "winston"
import axios from "axios"
class OtpService {


    protected async sendOtp(phoneNumber: string, text: string) {
        const url = `http://staticking.org/index.php/smsapi/httpapi/?uname=attire&password=Zattire121&receiver=${phoneNumber}&route=PA&msgtype=1&sender=default&sms=${text}`
        const res = await axios.get(url)
        if(res.status === 200){
            return res.data
        }
        throw Error(`sendOtp status code: ${res.status} and message ${res.data}`)
    }

    


}