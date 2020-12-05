import mongoose from "../database";
import { PromoCodeSI } from "../interfaces/promo-code.interface";


const PromoCodeSchema = new mongoose.Schema({
    promo_code: {
        type: String,
        required: true,
        unique: true,
    },
    description:{
        type: String,
        required: true
    },
    salon_ids:{
        type: [String],
    },
    categories:{
        type: [String],
    },
    user_ids: {
        type: [String]
    },
    expiry_date_time: {
        type: Date,
        required: true
    },
    time_type:{
        type: String,
        enum: ['All Day', 'Custom'],
        required: true
    },
    custom_time_days: {
        type: [Number],
    },
    custom_time_start_time: {
        type: String,
    },
    custom_time_end_time: {
        type: String,
    },
    minimum_bill:{
        type: Number,
        min: 1,
        required: true
    },
    discount_type: {
        type: String,
        enum: ['Flat Price', 'Discount Percentage'],
        required: true
    },
    flat_price:{
        type: Number,
    },
    discount_percentage:{
        type: Number,
    },
    discount_cap:{
        type: Number,
        required: true
    },
    payment_mode: {
        type: String,
        enum: ['COD', 'Online', 'Both'],
        required: true
    },
    max_usage:{
        type: Number,
        default: 1
    },
    usage_time_difference:{
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const PromoCode = mongoose.model<PromoCodeSI>("promoCodes", PromoCodeSchema)

export default PromoCode