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
        }
    }
},{
    timestamps: true
})
const referral = mongoose.model<ReferralSI>("referral", ReferralCodeSchema)

export default referral