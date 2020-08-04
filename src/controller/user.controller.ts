import BaseController from "./base.controller";
import UserService from "../service/user.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";

import logger from "../utils/logger";
import Review from "../models/review.model";
import RevenueService from "../service/revenue.service";
import ReviewSI from "../interfaces/review.interface";


export default class UserController extends BaseController{
    service: UserService
    constructor(service: UserService) {
        super(service)
        this.service = service
    }

    getUser = controllerErrorHandler( async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const user = await this.service.getUser(id)
        if(user===null){
            logger.error(`Unable to fetch user details`)
            res.status(400)
            res.send({ message: `Unable to fetch user details` })
            return
        }
        res.send(user)

    })
    update = controllerErrorHandler( async (req: Request, res: Response) => {
        //@ts-ignore   
        const id = req.userId
        const d = req.body
        const user = await this.service.update(id,d)
        if(user===null){
            logger.error(`Unable to update details`)
            res.status(400)
            res.send({ message: `Unable to fetch update details` })
            return
        }
        res.send(user)

    })

    updatePassword = controllerErrorHandler( async (req: Request, res: Response) => {
        //@ts-ignore
        const id  = req.userId
        const password = req.body.password
        const newPassword = req.body.newPassword
        const update = await this.service.updatePass(id,password,newPassword)
        if(update===null){
            logger.error(`Unable to update password`)
            res.status(400)
            res.send({ message: `Unable to update password` })
            return
        }
        res.send(update)
    })
    pastBooking = controllerErrorHandler( async (req: Request, res: Response) => {
        //@ts-ignore
        const id  = req.userId
        const booking = await this.service.pastBooking(id)
        if(booking===null){
            logger.error(`No bookings found`)
            res.status(400)
            res.send({ message: `No bookings found` })
            return
        }
        res.send(booking)

    })
    addAddress = controllerErrorHandler( async (req: Request, res: Response) => {
        const d = req.body
         //@ts-ignore
         const id  = req.userId
         const address = await this.service.addAddress(id,d)
         if(address===null){
            logger.error(`Unable to add Address`)
            res.status(400)
            res.send({ message: `Unable to add Address` })
            return
        }
        res.send(address)


    })
    getAddress = controllerErrorHandler( async (req: Request, res: Response) => {
         //@ts-ignore
         const id  = req.userId
         const address = await this.service.getAddress(id)
         if(address===null){
            logger.error(`No address found`)
            res.status(400)
            res.send({ message: `No address found` })
            return
        }
        res.send(address)


    })

}