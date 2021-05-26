import mongoose from "../database";
import { VendorSI } from "../interfaces/vendor.interface";


const VendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
        required: true
    },
    premium: {
        type: Boolean,
        default: false
    },
    designers: {
        type:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "designers"
        }]
    },
    profile_pic: { // this is the DP of vendor
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos"
    },
    makeup_artists: {
        type:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "makeup_artists"
        }]
    },
    salons: {
        type:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "salons"
        }]
    },
    blocked: {
        type: Boolean,
        default: false
    },
    fcm_token: {
        type: [String]
    },
    notification: {
        type: Boolean,
        default:true
    },
    uid:{
        type:String,
    },
}, {
    timestamps: true
})

const Vendor = mongoose.model<VendorSI>("vendors", VendorSchema)

export default Vendor