import controllerErrorHandler from "../middleware/controller-error-handler.middleware"
import ReportsSalonService from "../service/salon-reports.service"
import logger from "../utils/logger"
import { Request, Response } from "express";
import BaseController from "./base.controller"

export default class ReportsSalonController extends BaseController{
    service: ReportsSalonService
    constructor(service: ReportsSalonService) {
        super(service)
        this.service = service
    }
    getSalonReport = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const q = req.query
        const report = await this.service.getSalonReport(id,q)
        res.status(200).send(report)
    })

    getSalonReportbyUser = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const q = req.query
        const report = await this.service.getSalonReportbyUser(id,q)
        res.status(200).send(report)
    })
   
}