import mongoose from "../database";
import { UserSI } from "../interfaces/user.interface";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        
    },
    email: {
        type: String,
    },
    password: {
        type: String,

    },
    signin_from: {
        type: String,
    },
    profile_pic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos"
    },
    phone: { 
        type: String,
        
     },
    uid:{
        type:String,
    },
    age: {
        type: String,
    },
    gender: {
        type: String,
    },
    color_complextion: {
        type: String,
    },
    blocked: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    favourites: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "salons"
        }]
    },
    fcm_token: {
        type: String
    },
    notification: {
        type: Boolean,
        default:true
    },
    address: {
        type: [{
            address: {
                type: String,
               required:true
            },
            city: {
                type: String,
                required:true
            },
            state: {
                type: String,
           //     enum:["Andra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Orissa","Punjab","Rajasthan","Sikkim","Tamil Nadu","Tripura","Uttaranchal","Uttar Pradesh","West Bengal","Andaman and Nicobar Islands","Chandigarh","Daman and Diu","Delhi","Lakshadeep","Pondicherry"],
                required:true
            },
            pincode:{
                type: Number,
                required:true
            },
            latitude: {
                type: Number,
            },
            longitude: {
                type: Number,
            },
            tag: {
                type: String,   
            },
           
        }]
    }
})

const User = mongoose.model<UserSI>("users", UserSchema)

export default User