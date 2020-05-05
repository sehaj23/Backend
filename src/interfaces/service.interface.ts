import mongoose from "../database";
import { OfferI } from "./offer.interface";
import { ReviewI } from "./review.interface";

export default interface ServiceI{
    name: string
    price: number
    photo?: string
    offers?: OfferI[]
    duration: number
    salon_id? : string
    mua_id?: string,
    reviews?: ReviewI[]
}

export interface ServiceSI extends ServiceI, mongoose.Document{}