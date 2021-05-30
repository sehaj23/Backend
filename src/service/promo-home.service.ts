import mongoose from "../database";
import BaseService from "./base.service";


export default class PromoHomeService extends BaseService {
    constructor(promoHomeModel: mongoose.Model<any, any>,) {
        super(promoHomeModel);

    }

    getActivePromos =  async()=>{
        const activePromo = await this.model.find({active:true})
        return activePromo
    }


}