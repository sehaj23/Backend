import mongoose from "../database";
import { VendorSI } from "../interfaces/vendor.interface";


const VendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
        required: true
    },
    premium: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

const Vendor = mongoose.model<VendorSI>("vendor", VendorSchema)

export default Vendor