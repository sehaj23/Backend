import mongoose from "../database";

export interface CartOption {
    option_id: string,
    service_id?: string,
    quantity: number,
    service_name: string,
    category_name: string,
    option_name: string
    price?: number
}
export type cartStatus = 'In use' | 'Booked' | 'Abandoned'

export default interface CartI {
    options: CartOption[] // option ids of the service
    total?: number
    salon_id: string
    user_id?: string
    status?: cartStatus
}

export interface CartSI extends CartI, mongoose.Document { }