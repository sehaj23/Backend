import { Request, Response } from "express"
import mongoose from "../database"
import { CashBackSI } from "../interfaces/cashback.interface"
import { WalletTransactionI, WalletTransactionSI } from "../interfaces/wallet-transaction.interface"
import controllerErrorHandler from "../middleware/controller-error-handler.middleware"
import Cashbackuser from "../models/cashback.model"
import CashbackService from "../service/cashback.service"
import WalletTransactionService from "../service/wallet-transaction.service"
import ErrorResponse from "../utils/error-response"

import BaseController from "./base.controller"

export default class CashbackController extends BaseController{
    
   cashbackService : CashbackService
   walletTransactionService:WalletTransactionService
    constructor(cashbackService : CashbackService, walletTransactionService:WalletTransactionService){
        super(cashbackService)
        this.cashbackService= cashbackService
        this.walletTransactionService=walletTransactionService
    }

    availCashback =  controllerErrorHandler( async (req: Request, res: Response) => {
        const id = req.params.id
        const cashback =  await this.service.getOneNoPopulate({_id:mongoose.Types.ObjectId(id)}) as CashBackSI
        if(!cashback) throw new ErrorResponse({message:"No cashback found"})
        if(cashback.opened == true && cashback.wallet_transaction != null ){
            throw new ErrorResponse({message:"Cashback already availed"})
        }else{
            try{

            const walletTransactionI: WalletTransactionI = {
                amount: cashback.amount,
                user_id:cashback.user_id.toString(),
                reference_model: 'Cashback',
                reference_id: cashback._id.toString(),
                transaction_type: "Cashback",
                transaction_owner: "ALGO",
                comment: "Cashback given"
            }
            const wallet = await this.walletTransactionService.post(walletTransactionI) as WalletTransactionSI
         
            cashback.wallet_transaction = wallet._id
            cashback.opened =  true
            await cashback.save()
            return res.status(200).send({message:"Money will be added into your wallet"})
        }catch(e){
            console.log(e)
                res.status(400).send({message:"Unexpected error occured"})
        }
        }

    })


    getCashbackUserList =  controllerErrorHandler( async (req: Request, res: Response) => {
     
           //@ts-ignore
           const userId = req.userId
        const cashback = await this.service.getNopopulate({ user_id:mongoose.Types.ObjectId(userId)})
        res.status(200).send(cashback)
    })

}