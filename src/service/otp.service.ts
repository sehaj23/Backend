import axios from "axios"
import mongoose from "../database"
import EmployeeSI from "../interfaces/employee.interface"
import OtpSI, { OtpI } from "../interfaces/otp.interface"
import UserI, { UserSI } from "../interfaces/user.interface"
import logger from "../utils/logger"
import BaseService from "./base.service"
import EmployeeService from "./employee.service"
import UserService from "./user.service"

export default class OtpService extends BaseService{

    userService: UserService
    employeeService: EmployeeService
    constructor(model: mongoose.Model<any, any>, userService: UserService, employeeService: EmployeeService) {
        super(model)
        this.userService = userService
        this.employeeService = employeeService
    }

    /**
     * @description This method to be used only while sending the notification
     * @param phone phone number of the user
     * @param text complete message you want to send
     */
    static async sendMessage(phone: string|string[], text: string){
        try {
            const url = `http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=Zattire&Password=qtir6656QT&SenderID=ZATTRE&Phno=${phone}&Msg=${text}`
            const res = await axios.get(url)
            if(res.status === 200){
                logger.info(`Text message sent to :: ${phone} :: ${text}`)
            }else{
                logger.info(`Text message error sending to :: ${phone} :: ${text}`)
            }
        } catch (error) {
            logger.info(`Text message error sending to :: ${phone} :: ${error.message}`)
        }
    }

    protected async sendOtp(phone: string, text: string) {
        try {
            const url = `http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=Zattire&Password=qtir6656QT&SenderID=ZATTRE&Phno=${phone}&Msg=${text}`
            const res = await axios.get(url)
            if(res.status === 200){
                return res.data
            }
            throw Error(`sendOtp status code: ${res.status} and message ${res.data}`)
        } catch (error) {
            throw error
        }
    }

    protected async verifyOtp(phone: string, otp: string): Promise<OtpSI> {
        const otpD = await this.model.findOne({phone, verified: false}).sort({ "createdAt": -1 }) as OtpSI
        if(otpD === null) throw new Error(`Phone does not match`)
        if(otpD.otp !== otp){
            throw new Error("Otp does not match")
        }
        otpD.verified = true
        await otpD.save()
        return otpD
    }
    protected async emailverifyOtp(email: string, otp: string): Promise<OtpSI> {
        const otpD = await this.model.findOne({email, verified: false}).sort({ "createdAt": -1 }) as OtpSI
        if(otpD === null) throw new Error(`email does not match`)
        if(otpD.otp !== otp){
            throw new Error("Otp does not match")
        }
        otpD.verified = true
        await otpD.save()
        return otpD
    }

    public async sendEmployeeOtp(phone: string): Promise<OtpSI>{
        const emp = await this.employeeService.getOne({phone}) as EmployeeSI
        if(emp === null) throw new Error(`No employee found with this phone number`);
        const otpNumber: string = this.getRandomInt().toString()
        const text: string = `Your login otp is ${otpNumber}`
        const otp: OtpI = {
            phone: phone,
            otp: otpNumber,
            user_type: 'Vendor'
        }
        const otpD = await this.post(otp)
        await this.sendOtp(phone, text)
        return otpD
    }

    public async sendUserOtp(phone: string): Promise<OtpSI>{
        const otpNumber: string = this.getRandomInt().toString()
        const text: string = `Your otp is ${otpNumber}`
        const otp: OtpI = {
            phone: phone,
            otp: otpNumber,
            user_type: 'User',
        }
        const otpD = await this.post(otp)
        await this.sendOtp(phone, text)
        return otpD
    }

    public async verifyUserOtp(phone: string, otp: string, userId: string): Promise<{otpD: OtpSI, user: UserSI}>{
        const otpD = await this.verifyOtp(phone, otp)
        const user = await this.userService.getId(userId) as UserSI
        if(user === null) throw new Error(`User not found to update phone number`)
        user.phone = phone
        await user.save()
        return {otpD, user}
    }
    public async emailVerifyUserOtp(email: string, otp: string, userId: string): Promise<{otpD: OtpSI, user: UserSI}>{
        const otpD = await this.emailverifyOtp(email, otp)
        const user = await this.userService.getId(userId) as UserSI
        user.approved=true
        
        await user.save()
        return {otpD, user}
    }

    public async signupUserWithPhoneSendOtp(phone: string): Promise<OtpSI>{
        const user = await this.userService.getOne({phone})
        console.log("user",user)
        if(user !== null) throw new Error(`User already registered with this phone number`)
        const otpNumber: string = this.getRandomInt().toString()
        const text: string = `Your otp is ${otpNumber}`
        const otp: OtpI = {
            phone: phone,
            otp: otpNumber,
            user_type: 'User',
        }
        const otpD = await this.post(otp)
        await this.sendOtp(phone, text)
        return otpD
    }

    public async signupUserWithPhoneVerifyOtp(phone: string, otp: string): Promise<UserSI>{
      const verifyOtp =   await this.verifyOtp(phone, otp)
        // const user: UserI = {
        //     phone
        // }
     //   const userSI = await this.userService.post(user) as UserSI
        return verifyOtp
    }

    public async verifyEmployeeOtp(phone: string, otp: string): Promise<OtpSI>{
        const otpD = await this.verifyOtp(phone, otp)
        return otpD
    }

    protected getRandomInt(): number {
        return Math.floor(1000 + Math.random() * 9000);
    }

    public async sendUserOtpEmail(email: string): Promise<OtpSI>{
        const otpNumber: string = this.getRandomInt().toString()
        const text: string = `Your otp is ${otpNumber}`
        const otp: OtpI = {
            email: email,
            otp: otpNumber,
            user_type: 'User',
        }
        const otpD = await this.post(otp)
        return otpD
    }

}