import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType } from "sequelize-typescript";
import mongoose from "../database";
import AdminI, { AdminSI } from "../interfaces/admin.interface";



const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum : ["admin", "sub-admin"],
        default: "admin"
    }
}, {
    timestamps: true
})


const Admin = mongoose.model<AdminSI>("admin", AdminSchema)

export default Admin