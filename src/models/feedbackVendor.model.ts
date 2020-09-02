import mongoose from "../database";



const FeedbackSchema = new mongoose.Schema({
    
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendors",
    },
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees",
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    rating:{
        type:Number
    },
    title: {
        type: String,
    },
    description: {
        required: true,
        type: String,
    },
   


})
const FeedbackVendor = mongoose.model("feedback", FeedbackSchema)

export default FeedbackVendor