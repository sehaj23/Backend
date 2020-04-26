/// <reference types="mongoose" />
import mongoose from "../database";
declare type BookinStatus = 'Requested' | 'Confirmed' | 'Vendor Cancelled' | 'Customer Cancelled' | 'Completed' | 'Vendor Cancelled After Confirmed' | 'Customer Cancelled After Confirmed';
declare type BookingPaymentType = 'COD' | 'Online';
declare type BookingLoaction = 'Customer Place' | 'Vendor Place';
export interface BookingServiceI {
    service_id: string;
    employee_id: string;
    service_name: string;
    service_real_price: number;
    service_discount?: number;
    service_discount_code?: string;
    service_total_price: number;
    zattire_commission: number;
    vendor_commission: number;
    service_time: Date;
}
export interface BookingI {
    user_id: string;
    makeup_artist_id?: string | mongoose.Schema.Types.ObjectId;
    designer_id?: string | mongoose.Schema.Types.ObjectId;
    salon_id?: string | mongoose.Schema.Types.ObjectId;
    services?: BookingServiceI[];
    status?: BookinStatus;
    price: number;
    payment_type: BookingPaymentType;
    balance?: number;
    date_time: Date;
    location: BookingLoaction;
}
export interface BookingSI extends BookingI, mongoose.Document {
}
export {};
