import { Request, Response } from "express";
import { WalletTransactionI } from "../interfaces/wallet-transaction.interface";
import { WalletRazorpaySI, WalletRazorpayStatus } from "../interfaces/walletRazorpay.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import WalletTransactionService from "../service/wallet-transaction.service";
import WalletRazorpayService from "../service/walletRazorpay.service";
import BaseController from "./base.controller";

export default class WalletRazorpayController extends BaseController {
    service: WalletRazorpayService
    walletTransactionService: WalletTransactionService
    constructor(service: WalletRazorpayService, walletTransactionService: WalletTransactionService) {
        super(service);
        this.walletTransactionService = walletTransactionService
    }

    post = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        const resource = await this.service.post(req.body, userId)
        res.send(resource)
    })

    transactionResponse = controllerErrorHandler(async (req: Request, res: Response) => {
        const { walletRazorpayId } = req.params
        const {
            status,
            razorpay_payment_data,
            error_message
        } = req.body
        const walletRazorpay = await this.service.transactionResponse(walletRazorpayId, status, razorpay_payment_data, error_message) as WalletRazorpaySI
        // sending to sqs
        if (walletRazorpay.status === WalletRazorpayStatus.SUCCESSFUL) {
            const walletTransactionI: WalletTransactionI = {
                amount: walletRazorpay.amount,
                user_id: walletRazorpay.user_id,
                reference_model: 'walletRazorpay',
                reference_id: walletRazorpay._id.toString(),
                transaction_type: "",
                transaction_owner: "ALGO",
                comment: "Credits Added"
            }
            await this.walletTransactionService.post(walletTransactionI)
        }
        res.send(walletRazorpay)
    })

}