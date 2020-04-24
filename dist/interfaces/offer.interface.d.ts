/// <reference types="mongoose" />
import mongoose from "../database";
export interface OfferI {
    salon_id: string;
    service_id: string;
    updated_price: number;
    start_date: Date;
    end_date: Date;
    approved?: boolean;
}
export default interface OfferSI extends OfferI, mongoose.Document {
}
