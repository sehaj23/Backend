import mongoose from "../database";
import { ServiceSI } from "../interfaces/service.interface";


const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
})

const Service = mongoose.model<ServiceSI>("service", ServiceSchema)

export default Service