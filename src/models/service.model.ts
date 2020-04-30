import mongoose from "../database";
import { ServiceSI } from "../interfaces/service.interface";


const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration:{
        type: String,
        enum : ["15 Min", "30 Min", '45 Min' , '60 Min'],
        default: "30 Min",
        required: true
    },
    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos"
    },
    salon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "salons"
    },
    mua_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "makeup_artists"
    }
})

const Service = mongoose.model<ServiceSI>("services", ServiceSchema)

export default Service