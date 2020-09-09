import mongoose from "../database";
import { BookingSI } from "../interfaces/booking.interface";



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
            service_real_price: {
                type: Number,
            },
            service_discount: {
                type: Number,
            },
            service_discount_code: {
                type: String,
            },
            service_total_price: {
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
            rescheduled_service_time: {
                type: Date,  
            },
           
        }]
    },
    status: {
        type: String,
        enum: ['Start','Done','Requested', 'Confirmed', 'Vendor Cancelled', 'Customer Cancelled', 'Completed', 'Vendor Cancelled After Confirmed', 'Customer Cancelled After Confirmed',"Rescheduled Canceled","Rescheduled"],
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
    }
}, {
    timestamps: true
})

const Booking = mongoose.model<BookingSI>("booking", BookingSchema)

export default Booking
