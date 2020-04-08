import mongoose from "../database";
import PhotoSI from "../interfaces/photo.interface";


const PhotoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tags:{
        type: [String],
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Photo = mongoose.model<PhotoSI>("photo", PhotoSchema)

export default Photo