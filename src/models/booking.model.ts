import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, HasMany } from "sequelize-typescript";
import mongoose from "../database";
import { BookingSI } from "../interfaces/booking.interface";
import { INTEGER } from "sequelize/types";



const BookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true
    },
    provider_id: {
        type: String,
        required:true
    },
    provider_type: {
        type: String,
        enum: ['MUA' , 'Salon' , 'Designer'],
        default: 'MUA'
    },
    services: {
        type: [{
            service_id: {
                type: String,
                required: true
            },
            service_name: {
                type: String,
                required: true
            },
            service_real_price: {
                type: Number,
                required: true
            },
            service_discount: {
                type: Number,
            },
            service_discount_code: {
                type: String,
            },
            service_total_price: {
                type: Number,
                required: true
            },
            zattire_commission: {
                type: Number,
                required: true
            },
            vendor_commission: {
                type: Number,
                required: true
            }
        }],
        required: true
    },
    status: {
        type: String,
        enum: ['Requested', 'Confirmed', 'Vendor Cancelled', 'Customer Cancelled', 'Completed', 'Vendor Cancelled After Confirmed', 'Customer Cancelled After Confirmed'],
        default:'Requested'
    },
    price: {
        type: Number,
        required: true
    },
    payment_type: {
        type: String,
        enum: ['COD' , 'Online'],
        default: 'COD'
    },
    balance:{
        type: Number,
        required: true,
        default: 0
    },
    date_time: {
        type: Date,
        required: true,
        default: Date.now()
    },
    location: {
        type: String,
        enum: ['Customer Place' , 'Vendor Place'],
        default: 'Vendor Place'
    }
}, {
    timestamps: true
})

const Booking = mongoose.model<BookingSI>("booking", BookingSchema)

export default Booking
