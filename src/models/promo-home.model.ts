
import mongoose from "../database";
import { PromoHomeSI } from "../interfaces/promo-home.interface";



const PromoHomeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        default:true
    },
    promocode_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "promoCodes",
    },
    priority : {
        type : Number,
        required : true
    },
    image_url : {
        type : String,
        required : true
    }
}, {
    timestamps: true
})
PromoHomeSchema.index({promo_code_id: 1, })

const PromoHomeCode = mongoose.model<PromoHomeSI>("promoHome", PromoHomeSchema)
export default PromoHomeCode