import mongoose from "../database";
import { OfferI } from "./offer.interface";

export type ServiceDuration = '15 Min' | '30 Min' | '45 Min' | '60 Min'
export default interface ServiceI{
    name: string
    price: number
    photo?: string
    offers?: OfferI[]
    duration: ServiceDuration
    salon_id? : string
    mua_id?: string
}

export interface ServiceSI extends ServiceI, mongoose.Document{}