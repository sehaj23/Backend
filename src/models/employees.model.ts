import mongoose from "../database";
import EmployeeSI from "../interfaces/employee.interface";

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    services: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services"
    },
    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos"
    }
}, {
    timestamps: true
})


const Employee = mongoose.model<EmployeeSI>("employees", EmployeeSchema)

export default Employee