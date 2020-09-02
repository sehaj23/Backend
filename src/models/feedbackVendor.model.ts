import mongoose from "../database";



const ReportSchema = new mongoose.Schema({
    
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendors",
    },
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees",
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
const FeedbackVendor = mongoose.model("feedback", ReportSchema)

export default FeedbackVendor