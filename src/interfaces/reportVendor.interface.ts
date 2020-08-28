import mongoose from "../database";
export interface ReportVendorI{
    vendor_id?: string 
    employee_id?: string 
    name: string,
    title:string,
    description: string
    
    
}
export interface ReportVendorI extends mongoose.Document{}