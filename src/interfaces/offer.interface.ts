import mongoose from "../database";


export interface OfferI{
    updated_price: number
    start_date: Date
    end_date: Date
    max_usage?: number
    disable?: boolean
    approved?: boolean
    unique_code?: string
}

export default interface OfferSI extends OfferI, mongoose.Document {}