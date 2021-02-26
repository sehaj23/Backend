import mongoose from "../database";
import { RazorpayPaymentData } from "./booking.interface";

export enum WalletRazorpayStatus {
    INITIATED = "INITIATED",
    SUCCESSFUL = "SUCCESSFUL",
    UNSUCCESSFUL = "UNSUCCESSFUL",
}

export interface WalletRazorpayI {
    razorpay_order_id?: string
    amount: number
    user_id: string
    status: WalletRazorpayStatus
    razorpay_payment_data?: RazorpayPaymentData
    error_message?: string
}
export interface WalletRazorpaySI extends WalletRazorpayI, mongoose.Document { }
