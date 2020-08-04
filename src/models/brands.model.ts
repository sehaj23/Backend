import mongoose from "../database";
import salons = require("../seeds/data/salons/salons");


const BrandSchema = new mongoose.Schema({

    brand_name: {
        required: true,
        type: String,
    },
    logo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos",
   //     required: true
    },
    salon_id: {
        type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "salons"  
        }]
    }


})
const Brand = mongoose.model("brand", BrandSchema)

export default Brand