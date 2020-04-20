import ServiceI from "./service.interface";
import mongoose from "../database";

export interface EmployeeI{
    name: string
    phone: string
    services: ServiceI[]
    photo?: string
}

export default interface EmployeeSI extends EmployeeI, mongoose.Document{}