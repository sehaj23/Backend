import { body } from "express-validator"
import { WalletRazorpayStatus } from "../interfaces/walletRazorpay.interface"
import BaseValidator from "./base.validator"


export class WalletRazorpayValidator {

    static post = [
        body("amount", "Need amount").notEmpty().isNumeric(),
        BaseValidator.validate
    ]

    static transactionResponse = [
        body("status").custom((s: any) => {
            if (!WalletRazorpayStatus[s]) {
                return Promise.reject("status is not right")
            }
            return Promise.resolve()
        }),
        BaseValidator.validate
    ]

}