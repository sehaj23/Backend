import mongoose from "../database";
import ReviewSI from "./review.interface";


type Provider = 'MUA' | 'Salon' | 'Designer'
type BookinStatus = 'Requested' | 'Confirmed' | 'Vendor Cancelled' | 'Customer Cancelled' | 'Completed' | 'Vendor Cancelled After Confirmed' | 'Customer Cancelled After Confirmed'
type BookingPaymentType = 'COD' | 'Online'
type BookingLoaction = 'Customer Place' | 'Vendor Place'

export interface BookingServiceI{
    option_id: string,
    employee_id?: string,
    service_name: string,
    service_real_price: number,
    duration:number,
    quantity: number,
    service_discount?: number,
    service_discount_code?: string,
    service_total_price: number,
    zattire_commission: number,
    vendor_commission: number,
    service_time: Date,
    rescheduled_service_time?: Date
}

export interface BookingAddressI{
    address: string
    lat?: number
    long?: number
}

export interface BookingI{
    user_id: string | mongoose.Schema.Types.ObjectId
    makeup_artist_id?: string | mongoose.Schema.Types.ObjectId// it can be anything MUA, Designer, Salon
    designer_id?: string | mongoose.Schema.Types.ObjectId// it can be anything MUA, Designer, Salon
    salon_id?: string | mongoose.Schema.Types.ObjectId// it can be anything MUA, Designer, Salon
    services?: BookingServiceI[]
    status?: BookinStatus
    payment_type: BookingPaymentType
    location: BookingLoaction
    reviews?: ReviewSI[],
    address:BookingAddressI
}

export interface BookingSI extends BookingI, mongoose.Document{}