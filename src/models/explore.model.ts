import mongoose from "../database";
const exploreSchema = new mongoose.Schema({
    service_name: {
        required: true,
        type: String,
    },
    gender: {
        required: true,
        type: String,
    },
    color: [{
        required: true,
        type: String,
    }],
    photo: {
        type: String,
       required: true
    },
    price:{
        type:Number,
        required:true
    },
    salon_id: {
        type:  mongoose.Schema.Types.ObjectId,
         ref: "salons"  
    },
    tags:[{
        type: String,
    }]
})
const Explore = mongoose.model("explore", exploreSchema)

export default Explore