import mongoose from "../database";
import { LocationI } from "./salon.interface";



export interface SalonShortI{
    name: string,
    location?: string,
    coordinates:LocationI,
    start_price?: number,
    rating?:number,
    profile_pic?:number
}


export default interface SalonShortSI extends SalonShortI, mongoose.Document{}
    
   