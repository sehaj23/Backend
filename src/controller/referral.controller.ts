import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import ReferralService from "../service/referral.service";
import BaseController from "./base.controller";
import { Request, Response } from "express";


export default class ReferralController extends BaseController {
    service: ReferralService
    constructor(service: ReferralService) {
        super(service)
        this.service = service
    }

    getRefferalbyCode = controllerErrorHandler(async (req: Request, res: Response) => {
        const code = req.body.rfcode
        const q = req.query
        const referral = await this.service.getReferralbyCode(code, q)
        res.status(200).send(referral)
    })


    getRefferalsByUser = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const q = req.query
        const referral = await this.service.getRefferalsByUser(id, q)
        res.status(200).send(referral)
    })

    getRefferals = controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query
        const referral = await this.service.getWithPagination(q)
        res.status(200).send(referral)
    })
}