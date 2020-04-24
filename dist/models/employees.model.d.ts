/// <reference types="mongoose" />
import mongoose from "../database";
import EmployeeSI from "../interfaces/employee.interface";
declare const Employee: mongoose.Model<EmployeeSI, {}>;
export default Employee;
