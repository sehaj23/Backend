import mongoose from "../database";
import ReviewSI from "../interfaces/review.interface";


const ReviewSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    salon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "salons",
    },
    mua_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "makeup_artists",
    },
    designer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "designers",
    },
    type: {
        type: String,
        enum: ['Positive', 'Moderate', 'Negative'],
        default: 'Moderate'
    },
    flagged: {
        type: Boolean,
        default: false
    },
    vendor_seen: {
        type: Boolean,
        default: false
    },
    pinned: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [{
            type: String,
        }]
    },
    reply: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "reviews"
        }]
    }
}, {
    timestamps: true
})

const Review = mongoose.model<ReviewSI>("reviews", ReviewSchema)

export default Review