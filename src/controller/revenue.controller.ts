import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import RevenueService from "../service/revenue.service";
import ErrorResponse from "../utils/error-response";
import logger from "../utils/logger";
import BaseController from "./base.controller";


export default class RevenueController extends BaseController {

    service: RevenueService
    constructor(service:  RevenueService) {
        super(service)
        this.service = service
    }

    adminRevenueBySalon = controllerErrorHandler( async (req: Request, res: Response) => {
        const {start_date, end_date} = req.query
        if(!start_date || !end_date) throw new ErrorResponse({message: "start_date and end_date is required"})
        const data = await this.service.adminRevenueBySalon(new Date(start_date as string), new Date(end_date as string))
        res.send(data)
    })

    adminTotalRevenue = controllerErrorHandler( async (req: Request, res: Response) => {
        const {start_date, end_date} = req.query
        if(!start_date || !end_date) throw new ErrorResponse({message: "start_date and end_date is required"})
        const data = await this.service.adminTotalRevenue(new Date(start_date as string), new Date(end_date as string))
        res.send(data)
    })

    revenue = controllerErrorHandler( async (req: Request, res: Response) => {
        const q = req.query
        
        const revenue = await this.service.revenue(q)
       if(revenue==null){
        const errMsg = "Unable to get Revenue";
        logger.error(errMsg);
        res.status(400);
        res.send({ message: errMsg });
    }
        res.send(revenue)
        
    })

    revenueByBookingId = controllerErrorHandler( async (req: Request, res: Response) => {
      //TODO:Validator
        const id = req.params.id
        const q = req.query
        const revenue = await this.service.revenueByBookingId(id,q)
        if(revenue==null){
            const errMsg = "Unable to get Revenue";
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
            res.send(revenue)
        
    })

    totalRevenue =controllerErrorHandler( async (req: Request, res: Response) => {

        const revenue = await this.service.totalRevenue()
        res.send(revenue)
    })



}