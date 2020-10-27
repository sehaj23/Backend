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
    booking_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking",
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
const Feedback = mongoose.model("feedback", FeedbackSchema)

export default Feedback