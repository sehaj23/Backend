import mongoose from "../database";
import { BannerSI } from "../interfaces/banner.interface";



const BannerSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["DEALS","COUPON CODE","SPECIAL DAY","COVID"],
        required:true
    },
    photo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos",
        required: true
    },
    active:{
        type:Boolean,
        required: true,
        default:false
    },
    salon_id: {
        type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "salons"  
        }]
    }
   
})

const Banner = mongoose.model<BannerSI>("banner", BannerSchema)

export default Banner