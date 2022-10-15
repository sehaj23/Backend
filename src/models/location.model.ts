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
        required: true
    },
    pincode: {
        type: Number,  
        required: true
    }
}, {
    timestamps: true
})
LocationSchema.index({
    city:1
})
LocationSchema.index({
    subarea:1
})

const Location = mongoose.model<LocationSI>("location", LocationSchema)

export default Location