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

    get = async (filters = {}) => {
        return await this.model.find(filters).select("-password").populate("profile_pic").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id")//.populate({
            // path: 'services',
            // model: 'services',
            // populate: {
            //     path: 'offers',
            //     model: 'offers',
            // }
        // }).populate('events').populate("salons").populate("designers").populate("makeup_artists").populate("photo_ids").exec()
    }

    /**
     * This is to find by multipleIds
     */
    getByIds = async (ids:string[]) => {
        return this.model.find(ids).select("-password").populate("profile_pic").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id")
    }

    getId = async (id: string) => {
         return await this.model.findById(id).select("-password").populate("profile_pic").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("events")  //.populate({
            
    //     }).populate('events').populate("salons").populate("designers").populate("makeup_artists").populate("photo_ids").exec()
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
        return await this.model.findById(_id).select("photo_ids").populate("photo_ids").exec()
    }

    putProfilePic = async (photoData:PhotoI,_id:string) => {
        // saving photos 
        const photo = await Photo.create(photoData)
        // adding it to event
        const newEvent = await this.model.findByIdAndUpdate({_id},  { profile_pic: photo._id }, { new: true }).populate("profile_pic").exec() // to return the updated data do - returning: true
        return newEvent 
}    

}