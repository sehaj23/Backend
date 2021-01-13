import moment = require("moment");
import { PromoCodeRedis } from "../redis/index.redis";
import BaseService from "./base.service";


export default class PromoCodeService extends BaseService {

    getByPromoCode = async (promoCode: string, userId: string, salonIds: string[], categories: string[]) => {
        const promoCodeRedis = await PromoCodeRedis.get(promoCode, { userId, salonIds, categories })
        if (promoCodeRedis === null) {

            const promo = await this.model.findOne({
                "promo_code": promoCode,
                "$and": [
                    { "$or": [{ "salon_ids": [] }, { "salon_ids": { "$in": salonIds } }] },
                    { "$or": [{ "categories": [] }, { "categories": { "$in": categories } }] },
                    { "$or": [{ "user_ids": [] }, { "user_ids": { "$in": [userId] } }] },
                    { "$or": [{ "start_date_time": { "$exists": false } }, { "start_date_time": { "$lte": Date.now() } }] }
                ],
                "expiry_date_time": { "$gte": Date.now() },
                "active": true
            })
            PromoCodeRedis.set(promoCode, promo, { userId, salonIds, categories })
            return promo
        }
        return JSON.parse(promoCodeRedis)
    }

    promoCodesByUserId = async (userId: string, salonIds: string[], categories: string[]) => {
        const today = moment()
        //@ts-ignore { $and: [ { $or : [ { salon_ids: []} , {salon_ids: {$in: []}} ] }, {$or : [ { categories: []} , {categories: {$in: []}} ]}] }
        const promoCodes = await this.get({
            "$and": [
                { "$or": [{ "salon_ids": [] }, { "salon_ids": { "$in": salonIds } }] },
                { "$or": [{ "categories": [] }, { "categories": { "$in": categories } }] },
                { "$or": [{ "user_ids": [] }, { "user_ids": { "$in": [userId] } }] },
                { "$or": [{ "start_date_time": { "$exists": false } }, { "start_date_time": { "$lte": today.startOf('day').toDate() } }] }
            ],
            "expiry_date_time": { "$gte": today.endOf('day').toDate() },
            "active": true
        })
        return promoCodes
    }

}