import mongoose from "../database";



const NotificationSchema = new mongoose.Schema({
    
    title:{
        required:true,
        type:String,
    },
    body:{
        required:true,
        type:String,
    },
    type:{
        type:String,
        enum:[ "DEALS","COUPON CODE","BOOKING","APP","CASHBACK"],
        required:true,
        default:"APP"
    },
    id:{
        type:String,
    },
    start_date_time: {
        type: Date,
    },
    expiry_date_time: {
        type: Date,
        required: true
    },
    custom_time_days: {
        type: [Number],
    },
    send_time: {
        type: String,
    },

   


})
const  Notification= mongoose.model("notification", NotificationSchema)

export default Notification