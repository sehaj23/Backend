import BaseService from "./base.service";

export default class ReferralService extends BaseService {
    getReferralByUserIdAndUpdate = async (userId: string, data: any) => {
        const referal = await this.model.findOneAndUpdate({ "referred_to.user": userId }, data, { new: true })
        return referal
    }

    getReferralbyCode = async (code: string, q: any) => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const referralReq = this.model.find({ "referred_to.referral_code": code }).skip(skipCount).limit(pageLength)
        const countReq = this.model.count({ "referred_to.referral_code": code })
        const [referral, count] = await Promise.all([referralReq, countReq])
        return { referral, count }
    }

    getRefferalsByUser = async (id: string, q: any) => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const referralReq = this.model.find({ referred_by: id }).populate("referred_to.user").skip(skipCount).limit(pageLength)
        // const referralReq = this.model.find({ referred_by: id }).populate("referred_to.user", "name", "email", "createdAt").skip(skipCount).limit(pageLength)
        const countReq = this.model.count({ referred_by: id })
        const [referral, count] = await Promise.all([referralReq, countReq])
        return { referral, count }
    }
}