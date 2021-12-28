import mongoose from "../database";
import ZattireServiceSI from "../interfaces/zattire-service.interface";



const ZattireServiceSchema = new mongoose.Schema({
    category_name: {
        type: String,
    },
    services: {
        type: [{
            service_checked:{
                type:Boolean,
            },
            service_name:{
                type: String, 
            },
            hsn_code:{
                type:String
            },
            service_loaction:{
                type: String, 
            },
            description:{
                type:String
            },
            photo:{
                type:String,
            },
            options: {
                type:[{
                    option_checked:{
                        type:Boolean
                    },
                    option_name:{
                        type:String,
                    },
                    option_service_location:{
                        type:String
                    },
                    option_gender:{
                        type:String
                    },
                   
                    option_men_active:{
                        type:Boolean
                    },
                    option_men_price:{
                        type:Number
                    },
                    option_men_duration:{
                        type:Number
                    },
                    option_women_price:{
                        type:Number
                    },
                    option_women_duration:{
                        type:Number
                    },
                    option_women_active:{
                        type:Number
                    }
                }]
            },
        }]
    
    },
   
}, {
    timestamps: true
})

const zattireServiceModel = mongoose.model<ZattireServiceSI>("zattire.services", ZattireServiceSchema)

export default zattireServiceModel