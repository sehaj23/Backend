
import mongoose from "../database";



export interface  ZattireServiceI{
    category_name:string,
    services:ServicesI[]
    
}

export interface ServicesI{
    service_checked:Boolean,
    service_name:string,
    service_loaction:string,
    options:OptionI[]
}
export interface OptionI{
    option_checked:Boolean,
    option_name:string,
    option_service_location:string,
    option_gender:string,
    option_men_active:Boolean,
    option_men_price:Number,
    option_men_duration:Number,
    option_women_price:Number,
    option_women_duration:Number,
    option_women_active:Number


}

export default interface ZattireServiceSI extends  ZattireServiceI, mongoose.Document{}