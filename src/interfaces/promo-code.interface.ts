import mongoose from "../database"
import { BookingPaymentType } from "./booking.interface"

export type PromoCodeTimeType = 'All Day' | 'Custom'
export type PromoCodeAmountType = 'Flat Price' | 'Discount Percentage'

export interface PromoCodeI{
    promo_code: string
    description: string
    salon_ids: string[]
    categories: string[]
    user_ids: string[]
    expiry_date_time: Date
    time_type: PromoCodeTimeType
    custom_time_days: number[] // starting from sunday, index 0, to saturday, index 6
    custom_time_start_time: string
    custom_time_end_time: string
    minimum_bill: number
    amount_type: PromoCodeAmountType
    flat_price: number
    discount_percentage: number
    discount_cap: number
    payment_mode: BookingPaymentType
    max_usage: number // this is how many times user can use the promo code
    usage_time_difference: number // this is the time difference between the usage of the coupon by the user. in minutes
    active: boolean
}

export interface PromoCodeSI extends PromoCodeI, mongoose.Document{}