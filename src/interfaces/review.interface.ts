import mongoose from "../database";

export type ReviewType = 'Positive' | 'Moderate' | 'Negative'

export interface ReviewI{
    message: string
    rating: number // out of 5 can be only int
    user_id?: string
    salon_id?: string
    mua_id?: string
    designer_id?: string
    type?: ReviewType // positive negative moderate
    flagged?: boolean
    vendor_seen?: boolean
    pinned?: boolean
    reply?: ReviewI[]
}

export default interface ReviewSI extends ReviewI, mongoose.Document{}