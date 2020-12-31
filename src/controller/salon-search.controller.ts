import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import SalonSearchService from "../service/salon-search.service";
import BaseController from "./base.controller";

export default class SalonSearchController extends BaseController {

    service: SalonSearchService
    constructor(service: SalonSearchService) {
        super(service)
    }

    getServicesByName = controllerErrorHandler(async (req: Request, res: Response) => {
        const data = await this.service.getServicesByName(req.query.service_name as string)
        res.send(data)
    })

}