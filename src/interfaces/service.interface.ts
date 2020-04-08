import mongoose from "../database";

export default interface ServiceI{
    name: string
    price: number
}

export interface ServiceSI extends ServiceI, mongoose.Document{}