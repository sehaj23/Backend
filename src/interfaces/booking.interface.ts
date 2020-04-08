import mongoose from "../database";

export type AdminRoleT = "admin" | "sub-admin"



type Provider = 'MUA' | 'Salon' | 'Designer'
type BookinStatus = 'Requested' | 'Confirmed' | 'Vendor Cancelled' | 'Customer Cancelled' | 'Completed'
type BookingPaymentType = 'COD' | 'Online'
type BookingLoaction = 'Customer Place' | 'Vendor Place'


export interface BookingI{
    user_id: number
    provider_id: number // it can be anything MUA, Designer, Salon
    service_id: number
    provider_type: Provider
    status: BookinStatus
    price: number
    payment_type: BookingPaymentType
    balance?: number
    date_time: Date
    location: BookingLoaction
}

export interface BookingSI extends BookingI, mongoose.Document{}