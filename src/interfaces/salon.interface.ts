import ServiceI from "./service.interface";
import mongoose from "../database";

export interface SalonI{
    name: string
    description: string
    contact_number: string
    email: string
    start_price: number
    end_price: number
    services?: ServiceI[]
    speciality: string[]
    location: string
    insta_link?: string
    fb_link?: string
    start_working_hours: Date[]
    end_working_hours: Date[]
    photo_ids?: number[]
    approved?: boolean
    vendor_id: number
}

export default interface SalonSI extends SalonI, mongoose.Document{}