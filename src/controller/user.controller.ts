import { Request, Response } from "express";
import * as jwt from 'jwt-then';
import CONFIG from "../config";
import { FeedbackI } from "../interfaces/feedback.interface";
import { UserSI } from "../interfaces/user.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import FeedbackService from "../service/feedback.service";
import OtpService from "../service/otp.service";
import UserService from "../service/user.service";
import SendEmail from "../utils/emails/send-email";
import ErrorResponse from "../utils/error-response";
import logger from "../utils/logger";
import BaseController from "./base.controller";
import moment = require("moment");


export default class UserController extends BaseController {
    service: UserService
    feedbackService: FeedbackService
    otpService: OtpService
    constructor(service: UserService, feedbackService: FeedbackService, otpService: OtpService) {
        super(service)
        this.service = service
        this.feedbackService = feedbackService
        this.otpService = otpService
    }

    getUser = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        console.log(id)
        // const redisUser = await UserRedis.remove(id, {type: "info"})
        const user = await this.service.getId(id) as UserSI
        if (user === null) {
            logger.error(`Unable to fetch user details`)
            res.status(400)
            res.send({ message: `Unable to fetch user details` })
            return
        }
        if (user.referral_code == undefined) {
            console.log("creating")
            const referral = await this.service.createRefferal(user.name ?? "ZATT", user._id.toString())
            const update = await this.service.update(user._id, { referral_code: referral })
            return res.send(update)
        }
        res.send(user)

    })
    update = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore   
        const id = req.userId
        const d = req.body

        const user = await this.service.update(id, d)
        if (user === null) {
            logger.error(`Unable to update details`)
            res.status(400)
            res.send({ message: `Unable to fetch update details` })
            return
        }
        res.send({ message: "details updated", success: "true" })

    })

    updateFCM = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const fcm = req.body.fcm_token
        const user = await this.service.updateFCM(id, fcm)
        if (user == null) {
            logger.error(`Unable to fetch info. Please Login again`)
            res.status(400)
            res.send({ message: `Unable to fetch info. Please Login again` })
            return
        }
        res.send(user)
    })

    deleteFcm = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const fcm = req.body.fcm_token
        const user = await this.service.deleteFCM(id, fcm)
        if (user == null) {
            logger.error(`Unable to fetch info. Please Login again`)
            res.status(400)
            res.send({ message: `Unable to fetch info. Please Login again` })
            return
        }
        res.send(user)
    })

    updatePassword = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const password = req.body.password
        const newPassword = req.body.newPassword
        const update = await this.service.updatePass(id, password, newPassword)
        if (update === null) {
            logger.error(`Unable to update password`)
            res.status(400)
            res.send({ message: `Unable to update password` })
            return
        }
        res.send(update)
    })

    pastBooking = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const booking = await this.service.pastBooking(id)
        if (booking === null) {
            logger.error(`No bookings found`)
            res.status(400)
            res.send({ message: `No bookings found` })
            return
        }
        res.send(booking)

    })
    addAddress = controllerErrorHandler(async (req: Request, res: Response) => {
        const d = req.body
        if (!d.address && !d.city && !d.state) {
            res.status(400)
            res.send({ message: `Send Full Address` })
            return

        }
        //@ts-ignore
        const id = req.userId
        const address = await this.service.addAddress(id, d)
        if (address === null) {
            logger.error(`Unable to add Address`)
            res.status(400)
            res.send({ message: `Unable to add Address`, success: "false" })
            return
        }
        res.send(address)


    })

    updateAddress = controllerErrorHandler(async (req: Request, res: Response) => {
        const d = req.body
        //@ts-ignore
        const id = req.userId
        const addressId = req.params.addressId
        const address = await this.service.updateAddress(id, addressId, d)
        res.send(address)
    })

    deleteAddress = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const addressId = req.params.addressId
        const address = await this.service.deleteAddress(id, addressId)
        res.send(address)
    })

    getAddress = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const address = await this.service.getAddress(id)
        if (address === null) {
            logger.error(`No address found`)
            res.status(400)
            res.send({ message: `No address found` })
            return
        }
        res.send(address)


    })

    addToFavourites = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const salonid = req.body.salon_id

        const user = await this.service.addToFavourites(id, salonid)
        if (user === null) {
            logger.error(`Unable to add favorites`)
            res.status(400)
            res.send({ message: `Unable to add to favourites` })
            return
        }
        res.send({ message: `added to favourites`, success: "true" })

    })
    removeFavourites = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const salonid = req.body.salon_id

        const user = await this.service.removeFavourites(id, salonid)
        if (user === null) {
            logger.error(`Unable to remove favorites`)
            res.status(400)
            res.send({ message: `Unable to remove from favourites` })
            return
        }
        res.send({ message: `Removed from favourites`, success: "true" })

    })
    getFavourites = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const q =  req.query
        const user = await this.service.getFavourites(id,q)
        if (user === null) {
            logger.error(`No Favourites`)
            res.status(400)
            res.send({ message: `No Favourites Found`, success: false })
            return
        }
        res.send(user)

    })
    postFeedback = controllerErrorHandler(async (req: Request, res: Response) => {
        const data: FeedbackI = req.body
        //@ts-ignore
        data.user_id = req.userId
        const feedback = await this.feedbackService.post(data)
        if (feedback === null) {
            logger.error(`Unable to create feedback`)
            res.status(400)
            res.send({ message: `Unable to create feedback` })
            return
        }
        res.status(200).send({ message: "Thank you for your feedback", success: true })

    })
    sendNotifcation = controllerErrorHandler(async (req: Request, res: Response) => {
        const fcm_token = req.body.fcm_token
        const message = {
            "notification": {
                "title": "$FooCorp up 1.43% on the day",
                "body": "$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day."
            }
        }
        const notification = await this.service.sendNotification(fcm_token, message)
        res.send(notification)
    })

    sendEmail = controllerErrorHandler(async (req: Request, res: Response) => {
        const email = await SendEmail.emailConfirm("developers@zattire.com", "123", "sehaj")
        res.send(email)
    })

    searchUsersByEmail = controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query
        const user = await this.service.searchUsersByEmail(q)
        res.send(user)

    })

    updateForgotPassword = controllerErrorHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body
        //@ts-ignore
        const id = req.userId
        const user = await this.service.updateNewPass(id, email, password)
        if (!user) res.status(400).send({ sucess: false, message: `password not updated for ${email}` })
        const token = await jwt.sign(user.toJSON(), CONFIG.USER_JWT, {
            expiresIn: '30 days',
        })
        res.send({ success: true, message: "Password Updated", token: token, gender: user.gender })
    })

    emailConfirm = controllerErrorHandler(async (req: Request, res: Response) => {
        const { email } = req.body
        const user = await this.service.getOne({ email }) as UserSI
        if (user) res.status(400).send({ sucess: false, message: "Email already Registered" })
        const number = await this.otpService.sendUserOtpEmail(email)
        SendEmail.emailConfirm(email, number.otp, user.name)
        res.send({ success: true, message: "Email Sent" })

    })
    emailConfirmAfterSignup = controllerErrorHandler(async (req: Request, res: Response) => {
        const { email } = req.body
        const user = await this.service.getOne({ email }) as UserSI
        // if(user) res.status(400).send({sucess:false,message:"Email already Registered"})
        const number = await this.otpService.sendUserOtpEmail(email)
        SendEmail.emailConfirm(email, number.otp, user.name)
        res.send({ success: true, message: "Email Sent" })

    })

    emailVerify = controllerErrorHandler(async (req: Request, res: Response) => {
        const { email, otp } = req.body
        const user = await this.service.getOne({ email }) as UserSI
        if (user === null) throw new ErrorResponse({ message: `User not found with ${email}` })
        const otpd = await this.otpService.emailVerifyUserOtp(email, otp, user._id.toString())
        res.status(200).send(otpd)

    })

    checkEmailVerfied = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const user = await this.service.getId(id)
        if (user.approved == false) {
            return res.status(400).send({ success: false, message: "User not verified", email: user.email })
        }
        return res.status(200).send({ success: true, message: "User  verified" })

    })

    appVersion = controllerErrorHandler(async (req: Request, res: Response) => {
        res.status(200).send({ ios: "1.2.0", android: "1.0.0", success: true })
    })

    deleteRequest = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const dataTime = moment()
        const deleteRequest = await this.service.update(id, { delete_request: dataTime })
        if (deleteRequest == null) {
            return res.status(400).send({ success: false, message: "Something went Wrong" })
        }
        return res.status(200).send({ success: true, message: "Delete Request Sent" })
    })

    refferal = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const user = await this.service.getId(id) as UserSI
        const referral = await this.service.createRefferal(user.name, user._id.toString())
        res.send({ referral: referral })

    })

    verifyReferral= controllerErrorHandler(async (req: Request, res: Response) => {
        const { referral_code} = req.body
        const  getRefferal = await this.service.get({referral_code})
        if(getRefferal.length == 0){
           return res.status(400).send({message:"Invalid Referral",success:false})
        }
        res.status(200).send({message:"Valid Referral",success:true})
    })

}