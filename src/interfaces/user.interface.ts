import mongoose from "../database";

export interface UserAddressI {
    address: string
    city: string
    state: string
    pincode: number
    latitude?: number
    longitude?: number
    tag?: string
}

export default interface UserI {
    name?: string
    email?: string
    password?: string
    signin_from?: string
    photo?: string
    age?: string
    gender?: string
    color_complextion?: string
    fcm_token?: string[],
    blocked?: boolean
    approved?: boolean
    address?: UserAddressI[]
    phone?: string
    balance?: number
    referral_code?: string,
    status?:number
}

export interface UserSI extends UserI, mongoose.Document { }