import mongoose from "../database";

export enum RefundTypeEnum {
    Normal_RazorPay = 'Normal - RazorPay',
    Instant_RazorPay = "Instant - RazorPay",
    Zattire_Wallet = "Zattire_Wallet"
}

export interface RefundI {
    type: RefundTypeEnum
    status: "Initiated" | "Successful" | "Error"
    razorpay_status?: string
    total_amount: number
    amount_refunded: number
    zattire_commision?: number
    user_id: string
    salon_id: string
    booking_id: string
    wallet_transaction_id?: string
    razorpay_refund_id?: string
    razorpay_response?: any
}

export default interface RefundSI extends mongoose.Document, RefundI { }