import mongoose from "../database";


type Provider = 'MUA' | 'Salon' | 'Designer'
type BookinStatus = 'Requested' | 'Confirmed' | 'Vendor Cancelled' | 'Customer Cancelled' | 'Completed' | 'Vendor Cancelled After Confirmed' | 'Customer Cancelled After Confirmed'
type BookingPaymentType = 'COD' | 'Online'
type BookingLoaction = 'Customer Place' | 'Vendor Place'

export interface BookingServiceI{
    service_id: string,
    service_name: string,
    service_real_price: number,
    service_discount?: number,
    service_discount_code?: string,
    service_total_price: number,
    zattire_commission: number,
    vendor_commission: number,
}

export interface BookingI{
    user_id: string
    makeup_artist_id?: string // it can be anything MUA, Designer, Salon
    designer_id?: string // it can be anything MUA, Designer, Salon
    salon_id?: string // it can be anything MUA, Designer, Salon
    services?: [BookingServiceI]
    status?: BookinStatus
    price: number
    payment_type: BookingPaymentType
    balance?: number
    date_time: Date
    location: BookingLoaction
}

export interface BookingSI extends BookingI, mongoose.Document{}