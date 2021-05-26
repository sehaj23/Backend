import mongoose from "../database";
import RefundSI from "../interfaces/refund.interface";


const RefundSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Normal - RazorPay", "Instant - RazorPay", "Zattire_Wallet"],
        required: true
    },
    status: {
        type: String,
        enum: ["Initiated", "Successful", "Error"],
        default: "Initiated",
        required: true
    },
    razorpay_status: String,
    total_amount: {
        type: Number,
        required: true,
        min: 0,
    },
    amount_refunded: {
        type: Number,
        required: true,
        min: 0,
    },
    zattire_commision: {
        type: Number,
        required: true,
        min: 0,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    salon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "salons",
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookings",
    },
    razorpay_refund_id: String,
    razorpay_response: Object
}, {
    timestamps: true
})

const Refund = mongoose.model<RefundSI>("refunds", RefundSchema)

export default Refund