import BaseController from "./base.controller";
import BookingService from "../service/booking.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import encryptData from "../utils/password-hash";
import Booking from "../models/booking.model";
import logger from "../utils/logger";


export default class BookingController extends BaseController{

    service: BookingService
    constructor(service: BookingService){
        super(service)
        this.service = service
    }
    
    getSalonEmployees = controllerErrorHandler(async (req: Request, res: Response) => {
          
        if (!req.params.salonId) {
            const errMsg = `Salon Id not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
            return;
        }
        if (!req.body.dateTime) {
            const errMsg = `dateTime not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
            return
        }
        const salon = await this.service.getSalonEmployees(req.body.username, req.body.dateTime)
        if (salon===null) {
            const errMsg = `salon not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(salon);
    
    })

    getSalonBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        if (!req.params.id) {
            const errMsg = 'Salon Id not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const booking = await this.service.getSalonBookings(req.params.id)
        if (booking===null) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.status(200).send(booking)
 

    
    })

}
