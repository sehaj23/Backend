import mongoose from "../database";
export interface FeedbackVendorI{
    vendor_id?: string 
    employee_id?: string 
    title:string,
    description: string,
  
    
    
}
export interface  FeedbackVendorI extends mongoose.Document{}