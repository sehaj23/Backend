import mongoose from "../database";
import { UserSI } from "../interfaces/user.interface";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    signin_from: {
        type: String,
    },
    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos"
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
    address: {
        type: [{
            address: {
                type: String,
            },
            city: {
                type: String,
            },
            state: {
                type: String,
                enum:["Andra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Orissa","Punjab","Rajasthan","Sikkim","Tamil Nadu","Tripura","Uttaranchal","Uttar Pradesh","West Bengal","Andaman and Nicobar Islands","Chandigarh","Daman and Diu","Delhi","Lakshadeep","Pondicherry"],
            },
            tag: {
                type: String,
            }
        }]
    }
})

const User = mongoose.model<UserSI>("users", UserSchema)

export default User