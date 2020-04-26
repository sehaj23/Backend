import mongoose from "../database";
import ServiceI from "./service.interface";
import EventI from "./event.interface";
import { EmployeeI } from "./employee.interface";

export interface MakeupArtistI{
    name: string
    description: string
    contact_number: string
    email: string
    start_price: number
    end_price: number
    services?: ServiceI[]
    events?: EventI[]
    employees?: EmployeeI[]
    speciality: string[]
    location: string
    insta_link?: string
    fb_link?: string
    start_working_hours: Date[]
    end_working_hours: Date[]
    photo_ids?: number[]
    approved?: boolean
    vendor_id: string
    commision_percentage?: number,
    commision_cap?: number
    commision_fixed_price?: number
}

export default interface MakeupArtistSI extends MakeupArtistI, mongoose.Document {}