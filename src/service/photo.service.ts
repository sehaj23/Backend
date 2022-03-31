import mongoose from "../database";
import BaseService from "./base.service";


export default class PhotoService extends BaseService {
    constructor(photoModel: mongoose.Model<any, any>,) {
        super(photoModel);
}
getPhotoAndUpdateUrl = async ()=>{
    const  getPhotos =  await this.model.find({name:"salon-pic"})
  
    //https://zattire-images.s3.ap-south-1.amazonaws.com/all-images/images/1623990226778_Screenshot%202020-10-16%20at%2011.47.26%20PM.png
    for await (const photo of getPhotos) {
        const url = photo.url.split("/")
        const newUrl =  "https://zattire-images.s3.ap-south-1.amazonaws.com/all-images/images/"+ url[url.length-1]
        await this.model.updateOne({_id:photo._id},{url:newUrl})
      }
       return {message:"done"}
    }

    // https://ik.imagekit.io/gn8ff3omop9/tr:w-630,h-320/1625844582166_covid.jpg
}

