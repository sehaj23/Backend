import mongoose from "../database";

export default interface ServiceI{
    name: string
    price: number
    photo?: string
}

export interface ServiceSI extends ServiceI, mongoose.Document{}