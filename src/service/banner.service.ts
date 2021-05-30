import mongoose from "../database";
import { BannerSI } from "../interfaces/banner.interface";
import Banner from "../models/banner.model";


import BaseService from "../service/base.service";

export default class BannerService extends BaseService{

    constructor(bannerModel: mongoose.Model<any, any>){
        super(bannerModel);
    }

    getActiveBanners = async()=>{
        const banner =  await this.model.find({active:true}).populate("photo_id") as BannerSI
        return banner
    }

}