import mongoose from "../database";
import { SalonSearchSI } from "../interfaces/salon-search.interface";


const SalonSearchSchema = new mongoose.Schema({
    category: String,
    service_name: String
}, {
    timestamps: true
})

const SalonSearch = mongoose.model<SalonSearchSI>("salon_searches", SalonSearchSchema)

export default SalonSearch