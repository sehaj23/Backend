import { Request, Response } from "express";
import { sqsWalletTransaction, SQSWalletTransactionI } from "../aws";
import { WalletRazorpaySI, WalletRazorpayStatus } from "../interfaces/walletRazorpay.interface";
import WalletRazorpayService from "../service/walletRazorpay.service";
import BaseController from "./base.controller";

export default class WalletRazorpayController extends BaseController {
    service: WalletRazorpayService
    transactionResponse = async (req: Request, res: Response) => {
        const { walletRazorpayId } = req.params
        const {
            status,
            razorpay_payment_data,
            error_message
        } = req.body
        const walletRazorpay = await this.service.transactionResponse(walletRazorpayId, status, razorpay_payment_data, error_message) as WalletRazorpaySI
        // sending to sqs
        if (walletRazorpay.status === WalletRazorpayStatus.SUCCESSFUL) {
            const sQSWalletTransactionData: SQSWalletTransactionI = {
                transaction_type: "Add Credits",
                user_id: walletRazorpay.user_id,
                wallet_razorpay_id: walletRazorpay._id.toString()
            }
            sqsWalletTransaction(sQSWalletTransactionData)
        }
        res.send(walletRazorpay)
    }

}