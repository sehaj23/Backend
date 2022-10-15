import mongoose from "../database";

const FilterHomeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["RATING","DISTANCE","CATEGORY","BRAND"],
        required:true
    },
    value: {
        type:String,
        required: true
    },
    priority:{
        type: Number,
        default: 2,
    }
})

const FilterHome = mongoose.model("filterHome", FilterHomeSchema)

export default FilterHome