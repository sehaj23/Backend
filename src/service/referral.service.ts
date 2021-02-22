import BaseService from "./base.service";



export default class ReferralService extends BaseService{

    getReferralByUserIdAndUpdate =async (userId:string,data:any)=>{
        const referal =  await this.model.findOneAndUpdate({"referred_to.user":userId},data,{new:true})
        return referal
    }
    
    getReferralbyCode  = async (code:string,q:any)=>{
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const referralReq =  this.model.find({"referred_to.referral_code":code})
        const countReq = this.model.aggregate([
            { "$count": "count" }
        ])
        const [referral,count]= await Promise.all([referralReq,countReq])
        return {referral,count}
    }

}