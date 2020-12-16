import BaseService from "./base.service";


export default class PromoCodeService extends BaseService {

    promoCodesByUserId = async (userId: string, salonIds: string[], categories: string[]) => {
        //@ts-ignore { $and: [ { $or : [ { salon_ids: []} , {salon_ids: {$in: []}} ] }, {$or : [ { categories: []} , {categories: {$in: []}} ]}] }
        const promoCodes = await this.get({
            "$and": [
                { "$or": [{ "salon_ids": [] }, { "salon_ids": { $in: salonIds } }] },
                { "$or": [{ "categories": [] }, { "categories": { "$in": categories } }] },
                { "$or": [{ "user_ids": [] }, { "user_ids": { "$in": [userId] } }] },
                { "$or": [{ "start_date_time" : { "$exists" : false} }, { "start_date_time": { "$lte": Date.now() } }]}
            ],
            "expiry_date_time": { "$gte": Date.now() },
            "active": true
        })
        return promoCodes
    }

}