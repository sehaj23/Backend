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
    approved: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model<UserSI>("users", UserSchema)

export default User