import { filter } from "bluebird";
import mongoose from "../database";
import Explore from "../models/explore.model";
import Location from "../models/location.model";
import Salon from "../models/salon.model";
import BaseService from "../service/base.service";

export default class ExploreService extends BaseService{
    constructor(exploreModel: mongoose.Model<any, any>){
        super(exploreModel);
    }

    getExploreBySalonId = async (q: any): Promise<any> => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        
        const resourceQuery = this.model.find(q, {}, { skip: skipCount, limit: pageLength })
        const resourceCountQuery = this.model.aggregate([
            { "$count": "count" }
        ])

        const [explore, pageNo] = await Promise.all([resourceQuery, resourceCountQuery])
        let totalPageNumber = 0
        if (pageNo.length > 0) {
            totalPageNumber = pageNo[0].count
        }
        const totalPages = Math.ceil(totalPageNumber / pageLength)
        return { explore, totalPages, pageNumber, pageLength }
    }

    getSimilarProducts=async(q:any,salonID:any,multipleKeyWords,exploreID:string)=>{
        let getSimilar
        console.log(multipleKeyWords)
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
       
         getSimilar = await Explore.find({_id:{$ne:exploreID},salon_id:salonID, tags:{$in:multipleKeyWords}}).skip(skipCount).limit(pageLength)
        if(getSimilar.length===0){
            const getSalon = await Salon.findById(salonID)
            const getSalonNearLocation = await Salon.findOne({location_id:getSalon?.location_id,_id:{$ne:getSalon._id}})
            if(getSalonNearLocation !== null){
            getSimilar =  await Explore.find({salon_id:getSalonNearLocation._id, tags:{$in:multipleKeyWords}}).skip(skipCount).limit(pageLength)
            }
        }
        return getSimilar
    }
    searchInExplore=async(phrase)=>{
        const explore = await Explore.aggregate([{

            $match:
            {
                    "service_name": {
                            $regex: `.*${phrase}.*`, $options: 'i'
                    },


            }

    },])
    return explore
    }

    filterExplore = async ( q: any) => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const keys = Object.keys(q)
        let filters ={}
        for (const k of keys) {
            switch (k) {
                case "color":
                    filters["color"] = {
                        "$in": q[k].split(",")
                    }
                    break
                case "tags":
                    filters["tags"] = {
                        "$in": q[k].split(",")
                    }
                    break
                case "start_price":
                    filters["options.price"] = {$gte: q[k]}
                    break
                    case "end_price":
                        filters["options.price"] = {$lte: q[k]}
                        break
                        case "subarea":
                            let locationIds =  []
                            let salonIds = []
                            const locations= await Location.find({subarea:q[k]}).limit(pageLength).skip(skipCount)
                            locations.map((e)=>{
                                locationIds.push(e._id)
                            })
                            const salon = await Salon.find({location_id:{$in:locationIds}}).limit(pageLength).skip(skipCount)
                            salon.map((e)=>{
                                salonIds.push(e._id)
                            })
                            filters["salon_id"]={
                                $in:salonIds
                            }
                            break
                        case "service_name":
                            filters["service_name"] = {
                                $regex: `.*${q[k]}.*`, $options: 'i'
                        }
                            break
                default:
                    filters[k] = q[k]
            }

        }
        console.log(filters)
        const exploreReq = this.model.find(filters).skip(skipCount).limit(pageLength).populate({ path: 'salon_id',
        model: 'salons',
        select: { '_id': 1,'temporary_closed':1,"book_service":1},}).sort({ "createdAt": -1 }).exec()
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