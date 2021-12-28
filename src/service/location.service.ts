import mongoose from "../database";
import Location from "../models/location.model";


import BaseService from "../service/base.service";

export default class LocationService extends BaseService{

    constructor(bannerModel: mongoose.Model<any, any>){
        super(bannerModel);
    }


}