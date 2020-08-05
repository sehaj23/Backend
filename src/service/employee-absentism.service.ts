import BaseService from "./base.service";
import mongoose from "../database";

export default class EmployeeAbsenteesmService extends BaseService{
    employeeAbsentismModel: mongoose.Model<any, any>
    constructor(employeeAbsentismModel: mongoose.Model<any, any>){
        super(employeeAbsentismModel)
        this.employeeAbsentismModel = employeeAbsentismModel
    }
}