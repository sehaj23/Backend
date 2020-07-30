import mongoose from "../database";
import { OfferI } from "./offer.interface";


export default interface OptionI{
   
   
    option_name:String,
    price:Number,
    duration:Number,
    gender:String,
    photo: mongoose.Schema.Types.ObjectId | String
    offers?: OfferI[]
    p
       
      
   
}

