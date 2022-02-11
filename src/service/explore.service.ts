import mongoose from "../database";
import Explore from "../models/explore.model";
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
}