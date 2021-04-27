import mongoose from "../database";
import { BannerSI } from "../interfaces/banner.interface";



const BannerSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["DEALS","PROMOCODE","COVID"],
        required:true
    },
    photo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos",
        required: true
    },
    promocode_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"promoCodes"
    },
    active:{
        type:Boolean,
        default:true
    },
    priority:{
        type:Number,
        default:2,
    }
   
})

const Banner = mongoose.model<BannerSI>("banners", BannerSchema)

export default Banner