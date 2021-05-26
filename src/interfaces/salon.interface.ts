import ServiceI, { ServiceSI } from "./service.interface";
import mongoose from "../database";
import EmployeeSI, { EmployeeI } from "./employee.interface";

export interface LocationI {
    type: 'Point',
    coordinates: {
        latitude?: number
        longitude?: number
    }
}
export interface SalonI{
    name: string
    description?: string
    contact_number: string
    email: string
    start_price?: number
    end_price?: number
    services?: ServiceI[] | ServiceSI[]
    employees?: EmployeeI[] | EmployeeSI[]
    speciality?: string[]
    profile_pic?:number,
    location?: string
    insta_link?: string
    fb_link?: string
    rating?:number,
    start_working_hours?: Date[]
    end_working_hours?: Date[]
    photo_ids?: number[]
    approved?: boolean
    vendor_id?: string
    commision_percentage?: number,
    commision_cap?: number
    commision_fixed_price?: number,
    coordinates:LocationI
}

export default interface SalonSI extends SalonI, mongoose.Document{}