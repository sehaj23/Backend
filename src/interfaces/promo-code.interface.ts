import mongoose from "../database"
import { BookingPaymentType } from "./booking.interface"

export type PromoCodeTimeType = 'All Day' | 'Custom'
export type PromoCodeDiscountType = 'Flat Price' | 'Discount Percentage'

export interface PromoDiscountResult {
    option_id: string
    category_name: string
    before_discount_price: number
    discount: number
    after_discount_price: number
}

export interface PromoCodeI{
    /**
     * This is the promo code needs to be unique
     */
    promo_code: string
    /**
     * Promo code description
     */
    description: string
    /**
     * list of salon ids promo code is applicable to. can be empty
     * if empty then it will not filter
     */
    salon_ids: string[]
    /**
     * list of the categories in the services promo code is applicable to. can be empty
     * if empty then it will not filter
     */
    categories: string[]
    /**
     * list of the user_ids in the services promo code is applicable to. can be empty
     * if empty then it will not filter
     */
    user_ids: string[]
    /**
     * expiry of the promo code
     */
    expiry_date_time: Date
    /**
     * promo code applicable time. Custom or all day
     */
    time_type: PromoCodeTimeType
    /**
     * list of days in number on the day on which the coupon is applicable on.
     * Starting from Sunday 0 snd ending at Saturday 6
     */
    custom_time_days: number[]
    /**
     * time start when the coupon is valid
     */
    custom_time_start_time: string
    /**
     * time end when the coupon is valid
     */
    custom_time_end_time: string
    minimum_bill: number
    disctount_type: PromoCodeDiscountType
    flat_price: number
    discount_percentage: number
    discount_cap: number
    payment_mode: BookingPaymentType
    max_usage: number // this is how many times user can use the promo code
    usage_time_difference: number // this is the time difference between the usage of the coupon by the user. in minutes
    active: boolean
}

export interface PromoCodeSI extends PromoCodeI, mongoose.Document{}