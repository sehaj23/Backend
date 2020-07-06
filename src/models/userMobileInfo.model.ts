import mongoose from "../database";

const UserMobileInfoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    }
}, {
    timestamps: true,
    strict: false
})

const UserMobileInfo = mongoose.model('user_mobile_info', UserMobileInfoSchema)

export default UserMobileInfo