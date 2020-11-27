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
        return await this.model.find(filters).select("-password").populate("profile_pic").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id")
    }

    getOne = async (filters = {}): Promise<any> => {
        return await this.model.findOne(filters).select("-password").populate("profile_pic").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id")
    }

    /**
     * This is to find by multipleIds
     */
    getByIds = async (ids: string[]) => {
        return this.model.find(ids).select("-password").populate("profile_pic").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("services.employee_id")
    }

    getId = async (id: string) => {
        return this.model.findOne({ _id: mongoose.Types.ObjectId(id) }).select("-password").populate("profile_pic").populate({ path: "employees", populate: { path: 'photo' } }).populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("events").populate("salons").populate("services.employee_id")  //.populate({
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

}