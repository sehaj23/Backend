import mongoose from "../database";

export interface CartOption{
    option_id: string
    quantity: number,
    service_name?:string
}
export type cartStatus = 'In use'|'Booked'|'Abandoned'

export default interface CartI{
    options: CartOption[] // option ids of the service
    total?: number
    salon_id: string
    user_id?: string
    status?: cartStatus
}

export interface CartSI extends CartI, mongoose.Document{}