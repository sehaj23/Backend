import mongoose from "../database";


const AdvertismentSchema = new mongoose.Schema({
    
    photo_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "photos"
        }]
    },
    salon_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "salon"
    },
    name:{
        required: true,
        type:String
    },
    description:{
        required:true,
        type:String
    },
    price:{
        required:true,
        type:Number
    },
    offer_price:{
        required:true,
        type:Number
    },
    services: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services"
    },
    valid_from:{
        type: Date,
        required:true
    },
    valid_to:{
        type: Date,
        required:true
    }
    
    


})