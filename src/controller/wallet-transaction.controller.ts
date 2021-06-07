

import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import WalletTransactionService from "../service/wallet-transaction.service";
import BaseController from "./base.controller";

export default class WalletTransactionController extends BaseController {
    service: WalletTransactionService

    getByUserId = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        const resource = await this.service.get({ user_id: userId })
        res.send(resource)
    })

}