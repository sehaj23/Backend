import mongoose from "../database";
import { OfferI } from "./offer.interface";
import { ReviewI } from "./review.interface";
import OptionsI from "./options.interface"

export default interface ServiceI{
    _id?: string
    name: string
    price: number
    options?:OptionsI[],
    category:string,
    duration: number
    reviews?: ReviewI[],
    gender:string
}

export interface ServiceSI extends ServiceI, mongoose.Document{}