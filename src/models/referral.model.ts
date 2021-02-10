import mongoose from "../database";
import { ReferralSI } from "../interfaces/referral.interface";

const ReferralCodeSchema = new mongoose.Schema({

    referred_by:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
        required: true
    },
    referred_to:{
        user:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'users',
            required: true
        },
        status:{
            type:String,
            enum: ['Used', 'Not Used']
        },
        referral_code:{
            type:String,
        },
        booking_id:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'booking',
        },
        booking_status:{
            type:String,
            enum: ['Online Payment Failed', 'Online Payment Requested', 'Start','Done','Requested', 'Confirmed', 'Vendor Cancelled', 'Customer Cancelled', 'Completed', 'Vendor Cancelled After Confirmed', 'Customer Cancelled After Confirmed',"Rescheduled Canceled","Rescheduled","Rescheduled and Pending"],
        }
    }
},{
    timestamps: true
})
const Referral = mongoose.model<ReferralSI>("referral", ReferralCodeSchema)

export default Referral