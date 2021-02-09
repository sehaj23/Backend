import BaseService from "./base.service";



export default class ReferralService extends BaseService{

    getReferralByUserIdAndUpdate =async (userId:string,data:any)=>{
        const referal =  await this.model.findOneAndUpdate({"referred_to.user":userId},data,{new:true})
        return referal
    }

}