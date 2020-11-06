import mongoose from "../database";

export type OtpUserType = 'Vendor' | 'User'

export interface OtpI{
    phone?: string
    otp?: string
    email?:string
    verified?: boolean
    user_type: OtpUserType
}

export default interface OtpSI extends OtpI, mongoose.Document{}