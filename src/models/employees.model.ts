import mongoose from "../database";
import EmployeeSI from "../interfaces/employee.interface";

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true ,unique:true},
    phone: { type: String, required: true},
    services: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
        }]
    },
    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos"
    },
    fcm_token: {
        type: [String]
    },
    gender: {
        type: String,
    },
    location: {
        type: String,
        enum: ['Customer Place' , 'Vendor Place', 'Both'],
        default: 'Both',
        required: true
    },
    blocked: {
        type: Boolean,
        default: false
    },
    notification: {
        type: Boolean,
        default:true
    }
}, {
    timestamps: true
})


const Employee = mongoose.model<EmployeeSI>("employees", EmployeeSchema)

export default Employee