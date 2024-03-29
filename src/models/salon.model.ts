import { Mongoose } from "mongoose";
import mongoose from "../database";
import SalonSI from "../interfaces/salon.interface";
const typeEnum = ["salon","mua"]
const SalonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type:{
        type:String,
        enum:typeEnum,
        default:"salon"
    },
    description: {
        type: String,
        //       required: true
    },
    contact_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    start_price: {
        type: Number,
        //      required: true
    },
    end_price: {
        type: Number,
        //      required: true
    },
    services: {
        type: [{
            description:{
                type:String
            },
            category: {
                type: String,
                required: true,

            },
            photo: {
                type:String
            },
            name: {
                type: String,
                required: true,
            },
            options: [{
                at_home: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                option_name: {
                    type: String,
                    default: 'Default',
                    required: true,

                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                },
                duration: {
                    type: Number,
                    default: 15,
                    required: true,
                    min: 15
                },
                gender: {
                    type: String,
                    enum: ["men", "women", "both"],
                    required: true
                },
                offers: {
                    type: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "offers"
                    }]
                }
            }]
        }]
    },
    employees: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "employees"
        }]
    },
    speciality: {
        type: [{ type: String }]
    },
    gst: {
        type: String,
    },
    pan: {
        type: String,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    location: {
        type: String
    },
   location_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "location"
   },
    insta_link: {
        type: String
    },
    fb_link: {
        type: String
    },
    start_working_hours: {
        type: [Date],
        //     required: true
    },
    end_working_hours: {
        type: [Date],
        //     required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
   temporary_closed: {
        type: Boolean,
        default: false
    },
    book_service: {
        type: Boolean,
        default: true
    },
    photo_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "photos"
        }]
    },
    profile_pic: { // this is the DP of salon
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos",
    },
   
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendors",
        required: true
    },
    commision_percentage: {
        type: Number
    },
    commision_cap: {
        type: Number
    },
    commision_fixed_price: {
        type: Number
    },
    payment_method_supported: {
        type: [String],
        default: ['COD', 'RAZORPAY', 'WALLET']
    },
    coordinates: {
        type: { type: String, enum: ['Point'] }, coordinates: [Number]
    },
}, {
    timestamps: true
})

SalonSchema.index({ coordinates: '2dsphere' });
SalonSchema.index({location_id:1})
SalonSchema.index({ type:1 });
SalonSchema.index({ 'name': 'text', 'services.name': 'text'  });


const Salon = mongoose.model<SalonSI>("salons", SalonSchema)

export default Salon