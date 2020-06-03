import mongoose from "../database";

export interface EmployeeAbsenteeismI{
    employee_id?: string | mongoose.Schema.Types.ObjectId
    absenteeism_date: Date | string
    absenteeism_times: string[]
}

export default interface EmployeeAbsenteeismSI extends EmployeeAbsenteeismI, mongoose.Document{}
