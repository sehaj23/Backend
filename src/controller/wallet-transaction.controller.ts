

import { Request, Response } from "express";
import { WalletTransactionI } from "../interfaces/wallet-transaction.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import WalletTransactionService from "../service/wallet-transaction.service";
import BaseController from "./base.controller";
import User from "../models/user.model";
export default class WalletTransactionController extends BaseController {
    service: WalletTransactionService

    getByUserId = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        const resource = await this.service.get({ user_id: userId })
        res.send(resource)
    })

    addMoneyInWallet = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const email = req.body?.email
        let user
        let phone
       
        const amount = parseInt(req.body?.amount.toString())
        if(!amount){
            return res.status(400).send({message:"Please send amount"})
        }
        if(!email){
            return res.status(400).send({message:"Please send email"})
        }
        if(email){
            user =  await User.findOne({email:email.toString()})
        }

        const walletTransactionI: WalletTransactionI = {
            amount:amount,
            user_id: user._id,
            reference_model: 'No Reference Money Add for Promotion',
            reference_id: "Amount Added By Admin",
            transaction_type: "Credits Added",
            transaction_owner: "ALGO",
            comment: "Credits Added"
        }
      const wallet =   await this.service.post(walletTransactionI)
        res.send(wallet)
    })

}