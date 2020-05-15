import mongoose from "../database";
import SalonSI from "../interfaces/salon.interface";

const SalonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
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
  //      required: true
    },
    end_price: {
        type: Number,
  //      required: true
    },
    services: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "services"
        }]
    },
    employees: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "employees"
        }]
    },
    speciality: {
        type: [{type: String}]
    },
    location:{
        type: String,
        required: true,
    },
    insta_link:{
        type: String
    },
    fb_link:{
        type: String
    },
    start_working_hours: {
        type: [Date],
        required: true
    },
    end_working_hours: {
        type: [Date],
        required: true
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
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendors",
        required: true
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


const Salon = mongoose.model<SalonSI>("salons", SalonSchema)

export default Salon