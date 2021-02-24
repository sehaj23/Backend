import mongoose from "../database";
import ReviewSI from "./review.interface";


type Provider = 'MUA' | 'Salon' | 'Designer'
export type BookinStatus = 'Refunded' | 'Online Payment Failed' | 'Online Payment Requested' | 'Requested' | 'Confirmed' | 'Vendor Cancelled' | 'Customer Cancelled' | 'Completed' | 'Vendor Cancelled After Confirmed' | 'Customer Cancelled After Confirmed' | 'Rescheduled Canceled' | 'Rescheduled' | 'No Show' | 'Low Funds Canceled'
export type BookingPaymentType = 'COD' | 'Online' | 'Both'
type BookingLoaction = 'Customer Place' | 'Vendor Place'
type BookingGender = 'men' | 'women' | 'both'
export type Author = 'User' | 'Admin' | 'Vendor'

export interface BookingServiceI {
    option_id: string,
    employee_id: string,
    service_name: string,
    category_name: string,
    option_name: string,
    service_real_price: number,
    duration: number,
    quantity: number,
    service_discount?: number,
    service_discount_code?: string,
    service_total_price: number,
    zattire_commission: number,
    vendor_commission: number,
    service_time: Date,
    gender: BookingGender,
    rescheduled_service_time?: Date
}

export interface BookingAddressI {
    address: string
    lat?: number
    long?: number
}
export interface BookingHistoryI {
    status_changed_to: BookinStatus,
    last_status: BookinStatus,
    changed_by: Author,
    vendor_id?: string | mongoose.Schema.Types.ObjectId,
    user_id?: string | mongoose.Schema.Types.ObjectId,
    admin_id?: string | mongoose.Schema.Types.ObjectId
    date_time?: Date
}

export interface RazorpayPaymentData {
    order_id: string
    payment_id: string
    signature: string
    verified: boolean
}


export enum BookingPaymentMode {
    COD = "COD",
    WALLET = "WALLET",
    RAZORPAY = "RAZORPAY"
}

export enum BookingPaymentVerifiedStatusEnum {
    PENDING = "PENDING",
    SUCCESSFUL = "SUCCESSFUL",
    UNSUCCESSFUL = "UNSUCCESSFUL"
}

export interface BookingPaymentI {
    amount: number
    mode: BookingPaymentMode
    verified_status: BookingPaymentVerifiedStatusEnum
    verification_error?: string
    transaction_id?: string
}

export interface BookingI {
    user_id: string | mongoose.Schema.Types.ObjectId
    makeup_artist_id?: string | mongoose.Schema.Types.ObjectId// it can be anything MUA, Designer, Salon
    designer_id?: string | mongoose.Schema.Types.ObjectId// it can be anything MUA, Designer, Salon
    salon_id?: string | mongoose.Schema.Types.ObjectId// it can be anything MUA, Designer, Salon
    services?: BookingServiceI[]
    status?: BookinStatus
    payments: BookingPaymentI[]
    location: BookingLoaction
    reviews?: ReviewSI[],
    address: BookingAddressI
    booking_numeric_id: number
    cancel_reason?: string
    razorpay_order_id?: string
    razorpay_payment_data?: RazorpayPaymentData
    history?: BookingHistoryI[]
    refund_id?: string
}

export interface BookingSI extends BookingI, mongoose.Document { }