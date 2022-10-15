import mongoose from "../database";

const BrandSchema = new mongoose.Schema({
    brand_name: {
        required: true,
        type: String,
    },
    logo_url: {
        required: true,
        type: String,
    },
    active: {
        required: true,
        type: Boolean,
    }
    // salon_id: {
    //     type: [{
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: "salons"  
    //     }]
    // }
})
const Brand = mongoose.model("brand", BrandSchema)

export default Brand