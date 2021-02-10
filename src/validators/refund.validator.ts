import { body } from "express-validator";
import { RefundTypeEnum } from "../interfaces/refund.interface";
import BaseValidator from "./base.validator";

export class RefundValidator {

    static post = [
        body("booking_id", "Need Razorpay order id").notEmpty().isMongoId(),
        body("refund_type").custom((s: any) => {
            if (!RefundTypeEnum[s]) {
                return Promise.reject("refund_type is not right")
            }
            return Promise.resolve()
        }),
        BaseValidator.validate
    ]

}