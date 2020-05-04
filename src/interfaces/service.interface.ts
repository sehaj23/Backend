import mongoose from "../database";
import { OfferI } from "./offer.interface";

export default interface ServiceI{
    name: string
    price: number
    photo?: string
    offers?: OfferI[]
    duration: number
    salon_id? : string
    mua_id?: string,
   
}

export interface ServiceSI extends ServiceI, mongoose.Document{}