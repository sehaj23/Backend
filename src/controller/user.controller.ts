import BaseController from "./base.controller";
import UserService from "../service/user.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import FeedbackService from "../service/feedback.service"
import logger from "../utils/logger";
import Review from "../models/review.model";
import RevenueService from "../service/revenue.service";
import ReviewSI from "../interfaces/review.interface";
import ErrorResponse from "../utils/error-response";
import { FeedbackI } from "../interfaces/feedback.interface";


export default class UserController extends BaseController {
    service: UserService
    feedbackService:FeedbackService
    constructor(service: UserService,feedbackService:FeedbackService) {
        super(service)
        this.service = service
        this.feedbackService=feedbackService
    }

    getUser = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        console.log(id)
        const user = await this.service.getId(id)
        if (user === null) {
            logger.error(`Unable to fetch user details`)
            res.status(400)
            res.send({ message: `Unable to fetch user details` })
            return
        }
        res.send(user)

    })
    update = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore   
        const id = req.userId

        const updates = Object.keys(req.body)
        const d = req.body
        const allowedupates = ["email", "name", "age", "gender", "color_complextion", "address", "phone", "profile_pic","fcm_token","notification"]
        const isvalid = updates.every((update) => allowedupates.includes(update))
        console.log(isvalid)
        if (!isvalid) {
            const errMsg = `Sorry ${updates} cannot be updated!`
            logger.error(errMsg)
            res.send({ message: errMsg })
            return
        }
        const user = await this.service.update(id, d)
        if (user === null) {
            logger.error(`Unable to update details`)
            res.status(400)
            res.send({ message: `Unable to fetch update details` })
            return
        }
        res.send({ message: "details updated", success: "true" })

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

        console.log(id)
        const user = await this.service.getFavourites(id)
        if (user === null) {
            logger.error(`No Favourites`)
            res.status(400)
            res.send({ message: `No Favourites Found`, success: false })
            return
        }
        res.send(user)

    })
    postFeedback= controllerErrorHandler(async (req: Request, res: Response) =>{
        const data:FeedbackI = req.body
         //@ts-ignore
         data.user_id=req.userId
        const feedback = await this.feedbackService.post(data)
        if(feedback===null){
            logger.error(`Unable to create feedback`)
            res.status(400)
            res.send({ message: `Unable to create feedback` })
            return
        }
        res.status(200).send({message:"Thank you for your feedback",success:true})

    })
    sendNotifcation= controllerErrorHandler(async (req: Request, res: Response) =>{
        const fcm_token= req.body.fcm_token
       const message ={
        "notification": {
          "title": "$FooCorp up 1.43% on the day",
          "body": "$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day."
        }
       }
        const notification =  await this.service.sendNotification(fcm_token,message)
        res.send(notification)
    })

    searchUsersByEmail = controllerErrorHandler(async (req: Request, res: Response) =>{
       const q = req.query
        const user = await this.service.searchUsersByEmail(q)
        res.send(user)

    })

}