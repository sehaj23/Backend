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
    description: {
        type: String
    },
    price:{
        type: Number
    },
    offer_price: {
        type: Number
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