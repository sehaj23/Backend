import { Request, Response } from "express";
import * as jwt from 'jwt-then';
import CONFIG from "../config";
import { FeedbackI } from "../interfaces/feedback.interface";
import UserI, { UserSI } from "../interfaces/user.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import FeedbackService from "../service/feedback.service";
import OtpService from "../service/otp.service";
import UserService from "../service/user.service";
import SendEmail from "../utils/emails/send-email";
import ErrorResponse from "../utils/error-response";
import logger from "../utils/logger";
import BaseController from "./base.controller";
import moment = require("moment");
import sendNotificationToDevice from "../utils/send-notification";
import { PhotoI } from "../interfaces/photo.interface";
import parseSignedRequest from "../utils/facebook-delete"
import User from "../models/user.model";
import mongoose from "../database";
import Cart from "../models/cart.model";
import { CartSI } from "../interfaces/cart.interface";

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
        // const redisUser = await UserRedis.remove(id, {type: "info"})
        const user = await this.service.getId(id) as UserSI
        if (user === null) {
            logger.error(`Unable to fetch user details`)
            res.status(400)
            res.send({ message: `Unable to fetch user details` })
            return
        }
        if (user.referral_code == undefined) {
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
        const q = req.query
        const user = await this.service.getFavouritesOfUser(id, q)
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

    cartNotif = controllerErrorHandler(async (req: any, res: Response) => {
        var cartsOp = []
        var tokens = []
        const carts = await Cart.find({
            createdAt: { $gte: new Date((new Date().getTime() - (1 * 24 * 60 * 60 * 1000))) },
            status: "In use"
        }).sort({ "createdAt": -1 }).populate('user_id');
        const currentDate: Date = new Date()
        console.log(`cron runnning, got carts ${carts.length}`);
        carts.forEach(cart => {
            const cartDate: Date = new Date(cart["updatedAt"])
            const minutes = Math.abs(currentDate.getTime() - cartDate.getTime()) / (1000 * 60);
            // high - low == cron_time
            if (minutes >= 1 && minutes <= 3) {
                cartsOp.push(cart)
                try {
                    var userdata = cart.user_id as UserI
                    tokens = tokens.concat(userdata.fcm_token)
                } catch (error) {
                    console.log("ERROR!! while adding token to array")
                }
            }
        })
        console.log(tokens);

        const message = {
            "notification": {
                "title": "Your services are waiting for you",
                "body": "Looks like you have added some services to your cart. Please check your cart and proceed to checkout"
            }
        }
        return res.send({tokens, len : carts.length, cartsOp})
        // const user = await User.findOne({ _id: mongoose.Types.ObjectId(req.userId)})
        // const cart = await Cart.findOne({ user_id: req.userId, status:"In use"}).sort({ "createdAt": -1 }).limit(1) as CartSI
        // if(cart == null)
        //     return res.status(400).send({message: "No cart found", success: false})

        // const currentDate:Date = new Date()
        // const cartDate:Date = new Date(cart["updatedAt"])
        // const minutes = Math.abs(currentDate.getTime() - cartDate.getTime()) / (1000 * 60);
        // if(minutes >= 1 && minutes <= 45){
        //     var data = [];
        //     const message = {
        //         "notification": {
        //             "title": "Your services are waiting for you",
        //             "body": "Looks like you have added some services to your cart. Please check your cart and proceed to checkout"
        //         }
        //     }
        //     user.fcm_token.forEach(async (fcm) => {
        //         const op = await this.service.sendNotification(fcm, message)
        //         data.push(op)
        //     });    
        //     return res.send({data, cartDate, currentDate, minutes, msg : "ready for notif", cart})
        // } else {
        //     return res.status(400).send({cartDate, currentDate, minutes, msg : "not ready for notif", cart})
        // }
    })

    sendEmail = controllerErrorHandler(async (req: Request, res: Response) => {
        const email = await SendEmail.emailConfirm("developers@zattire.com", "123", "sehaj")
        res.send(email)
    })

    // searchUsersByEmail = controllerErrorHandler(async (req: Request, res: Response) => {
    //     const q = req.query

    //     const user = await this.service.searchUsersByEmail(q)
    //     res.send(user)

    // })
    searchUsers = controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query
        if (!q.phrase) {
            return res.status(400).send({ message: "please send search phrase" })
        }
        const user = await this.service.searchUser(q)
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
    deleteFB = async (req: Request, res: Response) => {
        try {


            //@ts-ignore
            const body = req.body
            const data = parseSignedRequest(body, "6f9e89563e39d240a32faf0066a00b36")
            const updateUserData = await this.service.updateOne({ uid: data.user_id }, { status: 2 })
            if (updateUserData) {
                return res.status(200).send({ url: "https://prodbackend.zattire.com/main-server/api/u/user/deleted?id=", code: updateUserData._id })
            }
            return res.status(200).send({ message: "Not able to delete" })
        } catch (error) {
            return res.status(200).send({ url: "https://prodbackend.zattire.com/main-server/api/u/user/deleted?id=", code: error.message })
        }
    }

    getDeleteUserData = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.query.id
        if (!id) {
            return res.status(400).send({ message: "send id in query" })
        }
        const getUser = await this.service.getOne({ _id: id }) as UserSI
        if (getUser.status === 2) {
            return res.status(200).send({ message: "User deleted" })
        }
        return res.status(200).send({ message: "deletion in progress" })
    })
    deleteRequest = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId || req.params.id
        const dataTime = moment()
        const deleteRequest = await this.service.delete(id)
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

    verifyReferral = controllerErrorHandler(async (req: Request, res: Response) => {
        const { referral_code } = req.body
        const getRefferal = await this.service.get({ referral_code })
        if (getRefferal.length == 0) {
            return res.status(400).send({ message: "Invalid Referral", success: false })
        }
        res.status(200).send({ message: "Valid Referral", success: true })
    })

    getWithPaginationtemp = controllerErrorHandler(async (req: Request, res: Response) => {
        const resource = await this.service.getWithPaginationtemp(req.query)
        res.send(resource)
    })


    sendNotificationToUsers = controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query
        const { title, body, type, id, status } = req.body
        const getUser = await this.service.getUserswithFilters(q)
        if (!title || !body || !type) {
            return res.status(400).send("title,body and type are required")
        }
        let message

        if (id == undefined) {
            message = {
                "notification": {
                    "title": title,
                    "body": body,


                },
                "data": {
                    "type": type,
                    click_action: "FLUTTER_NOTIFICATION_CLICK"
                },
            }
        } else {
            message = {
                "notification": {
                    "title": title,
                    "body": body,
                },
                "data": {
                    "type": type,
                    "id": id,
                    "status": status,
                    click_action: "FLUTTER_NOTIFICATION_CLICK"
                }
            }
        }
        let tokenList = []
        getUser.map((e) => {
            tokenList = tokenList.concat(e.fcm_token)

        })
        let sendNotifcation
        try {
            sendNotifcation = await sendNotificationToDevice(tokenList, message)

        } catch (error) {
            console.log(error)
            return res.status(400).send(error)
        }
        return res.status(200).send(sendNotifcation)
    })
    updateProfilePic = async (req: Request, res: Response) => {
        try {
            const photoData: PhotoI = req.body
            //@ts-ignore
            const _id = req.userId
            const newEvent = await this.service.updateUserphoto(photoData, _id)

            res.send(newEvent)
        } catch (e) {
            logger.error(`User Put Photo ${e.message}`)
            res.status(403).send(`${e.message}`)
        }
    }

    deleteUser = async (req: Request, res: Response) => {
        try {
            let deleteUser
            const q = req.query
            if (!q) {
                res.send({ message: "please send email in query" })
            }
            if (q.email) {
                deleteUser = await this.service.deleteByFilter({ email: q.email })
            } else if (q.phone) {
                deleteUser = await this.service.deleteByFilter({ phone: q.phone })
            }
            res.send(deleteUser)

        } catch (error) {
            res.status(400).send(error)
        }
    }

    getUserAdmin = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const getUser = await this.service.getId(id)
            if (getUser === null) {
                return res.status(404).send({ message: "User not found" })
            }
            res.send(getUser)
        } catch (error) {
            res.status(400).send(error)
        }
    }

}
