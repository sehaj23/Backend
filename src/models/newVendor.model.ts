import mongoose from "../database";


const NewVendorSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    address:{
        type: String
    },
    phone: {
        type: String
    }
}, {
    timestamps: true,
    strict: false
})

const NewVendor = mongoose.model("new_vendor", NewVendorSchema)

export default NewVendor