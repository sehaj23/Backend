import mongoose from "../database";

export type bannerType= "DEALS"|"COUPON CODE"|"SPECIAL DAY"|"COVID"

export interface BannerI{
    name:string,
    type:bannerType,
    photo_id: mongoose.Schema.Types.ObjectId | String
    active:boolean,
    salon_id: mongoose.Schema.Types.ObjectId | String
}


export interface BannerSI extends BannerI, mongoose.Document { }