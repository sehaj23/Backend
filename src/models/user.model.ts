import mongoose from "../database";
import { UserSI } from "../interfaces/user.interface";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
})

const User = mongoose.model<UserSI>("user", UserSchema)

export default User