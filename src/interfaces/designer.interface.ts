import mongoose from "../database"
import { PhotoI } from "./photo.interface";


export interface DesignersI{
    brand_name: string
    designer_name: string
    contact_number: string
    description?: string
    email: string
    start_price?: number
    end_price?: number
    outfit_types?: string[]
    speciality?: string[]
    location?: string
    insta_link?: string
    fb_link?: string
    start_working_hours?: Date[]
    end_working_hours?: Date[]
    photo_ids?: PhotoI[]
    approved?: boolean
    vendor_id: string // the id of the vendor _id
    commision_percentage?: number,
    commision_cap?: number
    commision_fixed_price?: number
}

export interface DesignersSI extends DesignersI, mongoose.Document{}