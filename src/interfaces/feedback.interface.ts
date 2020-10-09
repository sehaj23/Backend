import mongoose from "../database";
export interface FeedbackI{
    vendor_id?: string 
    employee_id?: string 
    user_id?:string
    booking_id?:string,
    title:string,
    description: string,    
}
export interface  FeedbackI extends mongoose.Document{}