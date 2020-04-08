import mongoose from "../database";


export interface VendorI{
    name: string
    email: string
    password?: string
    contact_number: string
    premium?: boolean
}
export interface VendorSI extends VendorI, mongoose.Document{}
