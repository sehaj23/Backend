import mongoose from "../database";
import BaseService from "./base.service";


export default class PromoUserService extends BaseService{
    constructor(promoModel: mongoose.Model<any, any>, ) {
        super(promoModel);
        
    }

}