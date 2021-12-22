import mongoose from "../database";


export interface LocationI{
    country: string
    state?: string
    city: string,
    subarea?: string,
    address?: string,
    pincode?:Number
    
}

export default interface LocationSI extends LocationI, mongoose.Document{}
