import ServiceI from "./service.interface";
import mongoose from "../database";
import OptionI from "./options.interface";

type ServiceLoaction = 'Customer Place' | 'Vendor Place' | 'Both'

export interface EmployeeI{
    name: string
    phone: string
    services: ServiceI[] | mongoose.Schema.Types.ObjectId[] | string[] // - from frontend just send services ids
    photo?: string
    fcm_token?: string
    location: ServiceLoaction
}

export default interface EmployeeSI extends EmployeeI, mongoose.Document{}