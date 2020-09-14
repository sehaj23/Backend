import BaseController from "./base.controller"
import OtpService from "../service/otp.service"
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware"

export default class OtpController extends BaseController {
    service: OtpService
    constructor(service: OtpService) {
        super(service)
        this.service = service
    }

    // this if for employee login
    sendEmployeeOtp = controllerErrorHandler(async (req: Request, res: Response) => {
        const {phone} = req.body
        await this.service.sendEmployeeOtp(phone)
        const out = {
            message: "Otp sent",
            success: true
        }
        res.send(out)
    })

    sendUserOtp = controllerErrorHandler(async (req: Request, res: Response) => {
        const {phone} = req.body
        await this.service.sendUserOtp(phone)
        const out = {
            message: "Otp sent",
            success: true
        }
        res.send(out)
    })

    verifyUserOtp = controllerErrorHandler(async (req: Request, res: Response) => {
        const {phone, otp} = req.body
        //@ts-ignore
        const data = await this.service.verifyUserOtp(phone, otp, req.userId)
        res.send(data)
    })

    verifyEmployeeOtp = controllerErrorHandler(async (req: Request, res: Response) => {
        const {phone, otp} = req.body
        const data = await this.service.verifyEmployeeOtp(phone, otp)
        res.send(data)
    })



}