import mongoose from "../database";
const exploreSchema = new mongoose.Schema({
    service_name: {
        required: true,
        type: String,
    },
    options:[{
        name: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        duration: {
            type: Number,
            default: 15,
            required: true,
            min: 15
        },
        gender: {
            type: String,
            enum: ["men", "women", "both"],
            required: true
        },
    }],
    color: [{
        required: true,
        type: String,
    }],
    photo: {
        type: String,
       required: true
    },
    salon_id: {
        type:  mongoose.Schema.Types.ObjectId,
         ref: "salons"  
    },
    tags:[{
        type: String,
    }],
    description:{
        type:String
    }
})
exploreSchema.index({ 'service_name': 'text' });
exploreSchema.index({ 'service_name': 'text' ,tags:1,color:1,price:1});
exploreSchema.index({tags:1,color:1,price:1})
exploreSchema.index({tags:1})
exploreSchema.index({color:1})
exploreSchema.index({price:1})
exploreSchema.index({salon_id:1})

const Explore = mongoose.model("explore", exploreSchema)

export default Explore