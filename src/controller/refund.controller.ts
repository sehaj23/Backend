import { Request, Response } from "express";
import { RefundTypeEnum } from "../interfaces/refund.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import RefundService from "../service/refund.service";
import BaseController from "./base.controller";
export default class RefundController extends BaseController {

    service: RefundService
    constructor(service: RefundService) {
        super(service)
        this.service = service
    }


    post = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        const { refund_type, booking_id } = req.body
        const refund = await this.service.createRefund(RefundTypeEnum[refund_type], booking_id, userId)
        res.send(refund)
    })

}