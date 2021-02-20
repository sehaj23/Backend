import { body, param } from "express-validator";
import BaseValidator from "./base.validator";

export class BookingValidator {

    static verifyRazorPayPayment = [
        body("order_id", "Need Razorpay order id").notEmpty(),
        body("payment_id", "Need Razorpay payment id").notEmpty(),
        body("signature", "Need Razorpay Signature").notEmpty(),
        param("bookingId", "Need mongo booking id").notEmpty().isMongoId(),
        BaseValidator.validate
    ]

}