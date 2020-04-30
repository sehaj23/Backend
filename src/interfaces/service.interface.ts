import mongoose from "../database";

export type ServiceDuratio = '15 Min' | '30 Min' | '45 Min' | '60 Min'
export default interface ServiceI{
    name: string
    price: number
    photo?: string
    duration: ServiceDuratio
    salon_id? : string
    mua_id?: string
}

export interface ServiceSI extends ServiceI, mongoose.Document{}