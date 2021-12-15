import mongoose from "../database";
import { PhotoI } from "../interfaces/photo.interface";
import Photo from "../models/photo.model";


export default class BaseService {
    model: mongoose.Model<any, any>
    modelName: string

    constructor(model: mongoose.Model<any, any>) {
        this.model = model
        this.modelName = model.modelName
    }

    post = async (data: any) => {
        return await this.model.create(data)
    }

    get = async (filters = {}): Promise<any[]> => {
        return await this.model.find(filters).select("-password").populate("profile_pic").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("photo").populate("photo_id")
    }
    getNopopulate = async (filters = {}): Promise<any[]> => {
        return await this.model.find(filters).select("-password")
    }

    getWithPagination = async (q: any): Promise<any> => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        
        const resourceQuery = this.model.find({}, {}, { skip: skipCount, limit: pageLength }).populate("photo_ids").populate("profile_pic").populate("user_id").sort([['rating', -1], ['createdAt', -1]]).lean()
        const resourceCountQuery = this.model.aggregate([
            { "$count": "count" }
        ])

        const [resource, pageNo] = await Promise.all([resourceQuery, resourceCountQuery])
        let totalPageNumber = 0
        if (pageNo.length > 0) {
            totalPageNumber = pageNo[0].count
        }
        const totalPages = Math.ceil(totalPageNumber / pageLength)
        return { resource, totalPages, pageNumber, pageLength }
    }

    getOne = async (filters = {}): Promise<any> => {
        return await this.model.findOne(filters).select("-password").populate("profile_pic").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id")
    }
    getOneNoPopulate = async (filters = {}): Promise<any> => {
        return await this.model.findOne(filters).select("-password")
    }
    getOnewithlean = async (filters = {}): Promise<any> => {
        return await this.model.findOne(filters).lean().select("-password").populate("profile_pic").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id")
    }

    /**
     * This is to find by multipleIds
     */
    getByIds = async (ids: string[]) => {
        return this.model.find({_id:{$in:ids}}).select("-password").populate("profile_pic").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("services.employee_id")
    }
    getByObjectIds = async (ids: string[]) => {
        return this.model.find(ids).select("-password").populate("profile_pic").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("services.employee_id")
    }

    getId = async (id: string) => {
        return this.model.findOne({ _id: mongoose.Types.ObjectId(id) }).select("-password").populate("profile_pic").populate({ path: "employees", populate: { path: 'photo' } }).populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("events").populate("salons").populate("services.employee_id").populate("photo") //.populate({
    }

    put = async (_id: string, data: any) => {
        return await this.model.findByIdAndUpdate({ _id }, data, { new: true }) // to return the updated data do - returning: true
    }


    putPhoto = async (_id: string, photoData: PhotoI) => {
        const photo = await Photo.create(photoData)
        //@ts-ignore
        return await this.model.findByIdAndUpdate({ _id }, { $push: { photo_ids: photo._id } }, { new: true }).populate("photo_ids").exec() // to return the updated data do - returning: true
    }

    getPhoto = async (_id: string) => {

        return await Photo.findById(_id)
    }

    putProfilePic = async (photoData: PhotoI, _id: string) => {
        // saving photos 
        const photo = await Photo.create(photoData)
        // adding it to event
        const newEvent = await this.model.findByIdAndUpdate({ _id }, { profile_pic: photo._id }, { new: true }).populate("profile_pic").exec() // to return the updated data do - returning: true
       
        return newEvent
    }

    delete = async (id: string) => {
        return this.model.deleteOne({ _id: id })
    }

    countDocumnet = async (filter: any) => {
        return this.model.countDocuments(filter)
    }
    getByName = async (promo_code: string) => {
        const promo = await this.model.findOne({ promo_code }).select({ payment_mode: 1, description: 1, promo_code: 1, _id: 1 })
        return promo
    }

    getAndUpdateByField = async (name: any,data: any) => {
        const promo = await this.model.findOneAndUpdate(name ,data,{new:true})
        return promo
    }



}