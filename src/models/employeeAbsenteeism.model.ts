import mongoose from "../database";
import EmployeeSI from "../interfaces/employee.interface";
import EmployeeAbsenteeismSI from "../interfaces/employeeAbsenteeism.interface";

const EmployeeAbsenteeismSchema = new mongoose.Schema({
    employee_id: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "employees",
        required: true
    },
    absenteeism_date: {
        type: Date,
        required: true
    },
    absenteeism_times:{
        type: [
            {
                type: [String]
            }
        ]
    }
}, {
    timestamps: true
})


const EmployeeAbsenteeism = mongoose.model<EmployeeAbsenteeismSI>("employeesAbsenteeism", EmployeeAbsenteeismSchema)

export default EmployeeAbsenteeism