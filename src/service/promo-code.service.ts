import moment = require("moment");
import mongoose from "../database";
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

    getPromoBySalon = async (salonId: string) => {
        const salons = await this.model.find({ "$or": [{ "salon_ids": [] }, { "salon_ids": { "$in": salonId } }] },).limit(8);
        return salons
    }

    getPromoforHomePage = async (q: any) => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const filter = {
            pageNumber,
            pageLength,
            skipCount
        }
        const redisKey = "getPromo"
        const cachedGetPromo = await PromoCodeRedis.get(redisKey, filter)
        let out
        if (cachedGetPromo == null) {
            const promoQuery = this.model.find({ active: true }, {}, { skip: skipCount, limit: pageLength }).select("-salon_ids")
            const promoCountQuery = this.model.aggregate([
                { "$count": "count" }
            ])

            const [promoCode, pageNo] = await Promise.all([promoQuery, promoCountQuery])
            let totalPageNumber = 0
            if (pageNo.length > 0) {
                totalPageNumber = pageNo[0].count
            }
            const totalPages = Math.ceil(totalPageNumber / pageLength)
            out = { promoCode, totalPages, pageNumber }
            PromoCodeRedis.set(redisKey, out, filter)

        } else {
            out = JSON.parse(cachedGetPromo)
        }
        return out
    }

    getPromoById = async (id: string) => {
        return this.model.findOne({ _id: mongoose.Types.ObjectId(id),active:true })
    }

}