import BaseController from "./base.controller";
import RevenueService from "../service/revenue.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";

import logger from "../utils/logger";

export default class RevenueController extends BaseController {

    service: RevenueService
    constructor(service:  RevenueService) {
        super(service)
        this.service = service
    }
    revenue =controllerErrorHandler( async (req: Request, res: Response) => {
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