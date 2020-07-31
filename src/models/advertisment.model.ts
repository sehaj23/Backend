import mongoose from "../database";


const AdvertismentSchema = new mongoose.Schema({

    photo_ids: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos",
        required: true
    },
    salon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "salon"
    },
    name: {
        required: true,
        type: String
    },
    description:{
        required:true,
        type:String
    }, 
   usp:{
        required:true,
        type:String
    },
    services: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services"
    },
    valid_from: {
        type: Date,
        required: true
    },
    valid_to: {
        type: Date,
        required: true
    }
})