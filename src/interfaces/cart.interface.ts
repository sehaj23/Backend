import mongoose from "../database";

export default interface CartI{
    option_ids: any[] // option ids of the service
    total: number
    salon_id: string
    user_id: string
}

export interface CartSI extends CartI, mongoose.Document{}