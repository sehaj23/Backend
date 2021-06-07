import mongoose from "../database";


const UserSearchSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    term: {
        type: String,
        required: true
    },
    filters: {
        type: Object
    },
    result: {
        type: Object
    }
}, {
    timestamps: true
})
const UserSearch = mongoose.model("user_searches", UserSearchSchema)

export default UserSearch