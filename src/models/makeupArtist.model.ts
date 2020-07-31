import mongoose from "../database";
import MakeupArtistSI from "../interfaces/makeupArtist.interface";


const MakeupArtistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
    //    required: true
    },
    contact_number:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    start_price: {
        type: Number,
//        required: true
    },
    end_price: {
        type: Number,
//        required: true
    },
    services: {
        type: [{
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
                type: Number,
                default: 15,
                required: true,
                min: 15
            },
            gender:{
                type:String,
                enum:["men","women"],
                required:true
            },
            photo: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "photos"
            },
            offers: {
                type: [{
                    type: mongoose.Schema.Types.ObjectId,
                     ref: "offers"
                }]
            }
        }]
    },
    speciality: {
        type: [{type: String}],
    //    required: true
    },
    location:{
        type: String,
    //    required: true,
    },
    insta_link:{
        type: String,
    },
    fb_link:{
        type: String,
    },
    start_working_hours: {
        type: [Date],
    //    required: true
    },
    end_working_hours: {
        type: [Date],
    //    required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    photo_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "photos"
        }]
    },
    profile_pic: { // this is the DP of MUA
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos"
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendors",
        required: true
    },
    employees: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "employees"
        }]
    },
    events: {
        type:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "events"
        }]
    },
    commision_percentage: {
        type: Number
    },
    commision_cap:{
        type: Number
    },
    commision_fixed_price:{
        type: Number
    }
}, {
    timestamps: true
})

const MakeupArtist = mongoose.model<MakeupArtistSI>("makeup_artists", MakeupArtistSchema)

export default MakeupArtist