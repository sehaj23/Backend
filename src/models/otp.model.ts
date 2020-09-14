import mongoose from "../database";
import OfferSI from "../interfaces/offer.interface";
import OtpSI from "../interfaces/otp.interface";


const OtpSchema = new mongoose.Schema({
    phone:{
        type: String,
        required:true
    },
    otp:{
        type: String,
        required: true
    },
    verified:{
        type: Boolean,
        default: false
    },
    user_type:{
        type: String,
        enum: ['Vendor', 'User'],
        required: true
    }
}, {
    timestamps: true
})

const Otp = mongoose.model<OtpSI>("otps", OtpSchema)

export default Otp