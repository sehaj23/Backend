import mongoose from "../database";
import LocationSI from "../interfaces/location.interface";
import PhotoSI from "../interfaces/photo.interface";


const LocationSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    subarea:{
        type: String,   
    },
    address:{
        type:String
    },
    pincode: {
        type: Number,   
        default: false
    }
}, {
    timestamps: true
})

const Location = mongoose.model<LocationSI>("location", LocationSchema)

export default Location