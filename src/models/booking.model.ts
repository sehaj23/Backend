import mongoose from "../database";
import { BookingSI } from "../interfaces/booking.interface";
import { BookingRedis } from "../redis/index.redis";



const BookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users',
        required: true
    },
    makeup_artist_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'makeup_artists',
    },
    designer_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'designers',
    },
    salon_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'salons',
    },
    services: {
        type: [{
            option_id: {
                type: String,
                required:true
            },
            employee_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "employees"
            },
            service_name: {
                type: String,
            },
            option_name: {
                type: String,
            },
            category_name: {
                type: String,
            },
            service_real_price: {
                type: Number,
            },
            service_discount: {  // discount amount
                type: Number,
            },
            service_discount_code: { //promo code
                type: String,
            },
            service_total_price: { //update price  real price - discount
                type: Number,   
            },
            quantity: {
                type: Number,
            },
            zattire_commission: {
                type: Number,  
            },
            vendor_commission: {
                type: Number,
            },
            service_time: {
                type: Date,  
            },
            gender:{
                type: String,
                enum: ["men", "women", "both"],
            },
            rescheduled_service_time: {
                type: Date,  
            },
           
        }]
    },
    status: {
        type: String,
        enum: ['Online Payment Failed', 'Online Payment Requested', 'Start','Done','Requested', 'Confirmed', 'Vendor Cancelled', 'Customer Cancelled', 'Completed', 'Vendor Cancelled After Confirmed', 'Customer Cancelled After Confirmed',"Rescheduled Canceled","Rescheduled","Rescheduled and Pending"],
        default:'Requested'
    },
    payment_type: {
        type: String,
        enum: ['COD' , 'Online'],
        default: 'COD'
    },
    location: {
        type: String,
        enum: ['Customer Place' , 'Vendor Place'],
        default: 'Vendor Place'
    },
    rescheduled_available_slots:{
        type: [
            {
                type: [Date]
            }
        ]
    },
    rescheduled_request_datetime:{
        type:Date
    },
    address:{
        type:{
            address:{
                type:String,
                required: true
            },
            latitude:{
                type:Number
            },
            longitude:{
                type:Number
            }
        },    
    },
    reviews: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'reviews',
    },
    cancel_reason: {
        type: String,
    },
    booking_numeric_id:{
        type: Number,
        required: true
    },
    razorpay_order_id: {
        type: String
    }
}, {
    timestamps: true
})

const emptyCartCache = (userId: string, options: Object = {}) => {
    BookingRedis.remove(userId, options)
}
BookingSchema.pre("save", function(){
    //@ts-ignore
    const {user_id} = this
    if(user_id){
        const userIdToUse = user_id?._id ?? user_id   
        emptyCartCache(userIdToUse, {type: "getByUserId"})
    }
})

BookingSchema.pre("remove", function(){
    //@ts-ignore
    const {user_id} = this
    if(user_id){
        const userIdToUse = user_id?._id ?? user_id   
        emptyCartCache(userIdToUse, {type: "getByUserId"})
    }
})

const Booking = mongoose.model<BookingSI>("booking", BookingSchema)

export default Booking
