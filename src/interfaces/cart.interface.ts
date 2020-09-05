import mongoose from "../database";

interface CartOption{
    option_id: string
    quantity: number
}

export default interface CartI{
    options: CartOption[] // option ids of the service
    total?: number
    salon_id: string
    user_id?: string
    booked?: boolean
}

export interface CartSI extends CartI, mongoose.Document{}