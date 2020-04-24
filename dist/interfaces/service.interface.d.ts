/// <reference types="mongoose" />
import mongoose from "../database";
export default interface ServiceI {
    name: string;
    price: number;
    photo?: string;
    salon_id?: string;
    mua_id?: string;
}
export interface ServiceSI extends ServiceI, mongoose.Document {
}
