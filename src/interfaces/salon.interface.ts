import ServiceI, { ServiceSI } from "./service.interface";
import mongoose from "../database";
import EmployeeSI, { EmployeeI } from "./employee.interface";


export interface SalonI{
    name: string
    description?: string
    contact_number: string
    email: string
    start_price?: number
    end_price?: number
    services?: ServiceSI[]
    employees?: EmployeeSI[]
    speciality?: string[]
    location?: string
    insta_link?: string
    fb_link?: string
    start_working_hours?: Date[]
    end_working_hours?: Date[]
    photo_ids?: number[]
    approved?: boolean
    vendor_id?: string
    commision_percentage?: number,
    commision_cap?: number
    commision_fixed_price?: number,
    longitude?:number,
    latitude?:number
}

export default interface SalonSI extends SalonI, mongoose.Document{}