import mongoose from "../database";
import OfferSI from "../interfaces/offer.interface";


const OfferSchema = new mongoose.Schema({
    salon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "salons",
        required: true
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services",
        required: true
    },
    updated_price:{
        type: Number,
        required: true
    },
    start_date:{
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    max_usage: {
        type: Number,
        default: 10000
    },
    disable:{
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const Offer = mongoose.model<OfferSI>("offers", OfferSchema)

export default Offer