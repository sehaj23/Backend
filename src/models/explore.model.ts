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
const Explore = mongoose.model("explore", exploreSchema)

export default Explore