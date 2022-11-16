import { filter } from "bluebird";
import mongoose from "../database";
import Explore from "../models/explore.model";
import Location from "../models/location.model";
import Salon from "../models/salon.model";
import BaseService from "../service/base.service";

export default class ExploreService extends BaseService {
    constructor(exploreModel: mongoose.Model<any, any>) {
        super(exploreModel);
    }

    getExploreBySalonId = async (salonID, q: any): Promise<any> => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 10)
        pageLength = (pageLength > 100) ? 25 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const resourceQuery = this.model.find({ salon_id: salonID }, {}, { skip: skipCount, limit: pageLength }).lean()
        const resourceCountQuery = this.model.find({ salon_id: salonID }).countDocuments()
        const [explore, pageNo] = await Promise.all([resourceQuery, resourceCountQuery])
        let totalPageNumber = 1
        if (pageNo.length > 0) {
            totalPageNumber = pageNo
        }
        const totalPages = Math.ceil(totalPageNumber / pageLength)
        return { explore, totalPages, pageNumber, pageLength }
    }

    getSimilarProducts = async (q: any, salonID: any, multipleKeyWords, exploreID: string) => {
        let getSimilar
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength

        getSimilar = await Explore.find({ _id: { $ne: exploreID }, salon_id: salonID, tags: { $in: multipleKeyWords } }).skip(skipCount).limit(pageLength)
        if (getSimilar.length === 0) {
            const getSalon = await Salon.findById(salonID)
            const getSalonNearLocation = await Salon.findOne({ location_id: getSalon?.location_id, _id: { $ne: salonID } })
            if (getSalonNearLocation !== null) {
                getSimilar = await Explore.find({ salon_id: getSalonNearLocation._id, tags: { $in: multipleKeyWords } }).skip(skipCount).limit(pageLength)
            }
        }
        return getSimilar
    }
    searchInExplore = async (phrase) => {
        const explore = await Explore.aggregate([{
            $match: { "service_name": { $regex: `.*${phrase}.*`, $options: 'i' }, },
        },])
        return explore
    }

    filterExplore = async (q: any) => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const keys = Object.keys(q)
        let filters = {}
        let projection = {}
        for (const k of keys) {
            switch (k) {
                case "service_name":
                    filters["service_name"] = {
                        $regex: `.*${q[k]}.*`, $options: 'i'
                    }
                    break
                case "color":
                    filters["color"] = {
                        "$in": q[k].replace("[", "").replace("]", "").split(",")
                    }
                    break
                case "tags":
                    filters["tags"] = {
                        "$in": q[k].replace("[", "").replace("]", "").split(",")
                    }
                    break
                case "start_price":
                    filters["options.price"] = { $gte: q[k] }
                    projection["options"] = { $elemMatch: { price: { $gte: q[k] } } }
                    break
                case "end_price":
                    //@ts-ignore
                    if (filters["options.price"] !== undefined) {
                        //@ts-ignore
                        filters["options.price"].$lte = q[k]
                    } else {
                        filters["options.price"] = { $lte: q[k] }
                    }
                    //@ts-ignore
                    if (projection.options !== undefined) {
                        //@ts-ignore
                        projection.options.$elemMatch.price.$lte = q[k]
                    }
                    break
                case "subarea":
                    let locationIds = []
                    let salonIds = []
                    const locations = await Location.find({ subarea: q[k] }).limit(pageLength).skip(skipCount)
                    locations.map((e) => { locationIds.push(e._id) })
                    const salon = await Salon.find({ location_id: { $in: locationIds } }).limit(pageLength).skip(skipCount)
                    salon.map((e) => { salonIds.push(e._id) })
                    filters["salon_id"] = { $in: salonIds }
                    break
                case "page_number":
                    delete q[k]
                case "page_length":
                    delete q[k]
                default:
                    filters[k] = q[k]
            }

        }


        const exploreReq = this.model.find(filters, projection).skip(skipCount).limit(pageLength).populate({
            path: 'salon_id',
            model: 'salons',
            select: { '_id': 1, 'temporary_closed': 1, "book_service": 1, "name": 1, "location_id": 1 }, populate: {
                path: 'location_id', model: "location"
            }
        }).select("service_name").select("description").select("tags").select("color").select("photo").select("options").sort({ "createdAt": -1 }).lean().exec()
        const explorePagesReq = this.model.countDocuments(filters)
        const [explore, exploreCount] = await Promise.all([exploreReq, explorePagesReq])
        let totalPageNumber = 0
        if (exploreCount > 0) {
            totalPageNumber = exploreCount
        }
        const totalPages = Math.ceil(totalPageNumber / pageLength)
        return { explore, totalPages, pageNumber, pageLength }



    }
}