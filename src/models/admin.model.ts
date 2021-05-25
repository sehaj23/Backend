import mongoose from "../database";
import AdminI, { AdminSI } from "../interfaces/admin.interface";



const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum : ["admin", "sub-admin"],
        default: "admin"
    },
    fcm_token: {
        type: [String]
    },
}, {
    timestamps: true
})


const Admin = mongoose.model<AdminSI>("admin", AdminSchema)

export default Admin