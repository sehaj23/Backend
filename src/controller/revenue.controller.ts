import { Request, Response } from "express";
import mongoose from "../database";
import { BookinStatus } from "../interfaces/booking.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import RevenueService from "../service/revenue.service";
import ErrorResponse from "../utils/error-response";
import logger from "../utils/logger";
import BaseController from "./base.controller";


export default class RevenueController extends BaseController {

    service: RevenueService
    constructor(service: RevenueService) {
        super(service)
        this.service = service
    }


    adminTotalRevenue = controllerErrorHandler(async (req: Request, res: Response) => {
        const { start_date, end_date, salon_ids, status } = req.query
        if (!start_date || !end_date) throw new ErrorResponse({ message: "start_date and end_date is required" })
        let salonIdCondition = {}
        if (salon_ids) {
            salonIdCondition = {
                "salon_id": {
                    "$in": salon_ids.toString().split(",").map((s: string) => mongoose.Types.ObjectId(s))
                }
            }
        }
        const totalDataReq = this.service.adminTotalRevenue(new Date(start_date as string), new Date(end_date as string), salonIdCondition, status as BookinStatus)
        const salonDataReq = this.service.adminRevenueBySalon(new Date(start_date as string), new Date(end_date as string), salonIdCondition, status as BookinStatus)
        const [totalData, salonData] = await Promise.all([totalDataReq, salonDataReq])
        res.send({ totalData, salonData })
    })

    revenue = controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query

        const revenue = await this.service.revenue(q)
        if (revenue == null) {
            const errMsg = "Unable to get Revenue";
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(revenue)

    })

    revenueByBookingId = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:Validator
        const id = req.params.id
        const q = req.query
        const revenue = await this.service.revenueByBookingId(id, q)
        if (revenue == null) {
            const errMsg = "Unable to get Revenue";
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(revenue)

    })

    totalRevenue = controllerErrorHandler(async (req: Request, res: Response) => {

        const revenue = await this.service.totalRevenue()
        res.send(revenue)
    })



}