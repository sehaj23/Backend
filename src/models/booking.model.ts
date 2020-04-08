import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, HasMany } from "sequelize-typescript";
import mongoose from "../database";
import { BookingSI } from "../interfaces/booking.interface";



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
    service_id: {
        type:String
    },
    status: {
        type: String,
        enum: ['Requested' , 'Confirmed' , 'Vendor Cancelled' , 'Customer Cancelled' , 'Completed'],
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
