import mongoose from "../database";

export type bannerType= "DEALS"|"COUPON CODE"|"COVID"

export interface BannerI{
    name:string,
    type:bannerType,
    photo_id: mongoose.Schema.Types.ObjectId | String
    active:boolean,
}


export interface BannerSI extends BannerI, mongoose.Document { }