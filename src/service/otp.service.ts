import { http } from "winston"
import axios from "axios"
import BaseService from "./base.service"
import OtpSI, { OtpI } from "../interfaces/otp.interface"
import mongoose from "../database"
import UserService from "./user.service"
import { UserSI } from "../interfaces/user.interface"
import EmployeeService from "./employee.service"
import EmployeeSI from "../interfaces/employee.interface"
import { phone } from "faker"

export default class OtpService extends BaseService{

    userService: UserService
    employeeService: EmployeeService
    constructor(model: mongoose.Model<any, any>, userService: UserService, employeeService: EmployeeService) {
        super(model)
        this.userService = userService
        this.employeeService = employeeService
    }

    protected async sendOtp(phone: string, text: string) {
        const url = `http://nimbusit.biz/api/SmsApi/SendSingleApi?UserID=Zattire&Password=qtir6656QT&SenderID=ZATTRE&Phno=${phone}&Msg=${text}`
        const res = await axios.get(url)
        if(res.status === 200){
            return res.data
        }
        throw Error(`sendOtp status code: ${res.status} and message ${res.data}`)
    }

    public async sendEmployeeOtp(phone: string): Promise<OtpSI>{
        const emp = await this.employeeService.getOne({phone}) as EmployeeSI
        if(emp === null) throw new Error(`No employee found with this phone number`);
        const otpNumber: string = this.getRandomInt(9999, 999).toString()
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
        const otpNumber: string = this.getRandomInt(9999, 999).toString()
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
        const otpD = await this.model.findOne({phone, otp, verified: false}) as OtpSI
        if(otpD === null) throw new Error(`Phone and otp do not match`)
        otpD.verified = true
        await otpD.save()
        const user = await this.userService.getId(userId) as UserSI
        if(user === null) throw new Error(`User not found to update phone number`)
        user.phone = phone
        await user.save()
        return {otpD, user}
    }

    public async verifyEmployeeOtp(phone: string, otp: string): Promise<OtpSI>{
        const otpD = await this.getOne({phone, otp, verified: false}) as OtpSI
        if(otpD === null) throw new Error(`Phone and otp do not match`)
        otpD.verified = true
        await otpD.save()
        return otpD
    }

    protected getRandomInt(max: number, min: number): number {
        return Math.floor(Math.random() * Math.floor(max) + min);
    }

}