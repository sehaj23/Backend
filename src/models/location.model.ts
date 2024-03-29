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
    },
    city:{
        type: String,      
    },
    subarea:{
        type: String,   
    },
    pincode: {
        type: Number,   
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