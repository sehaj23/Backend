import mongoose from "../database";
import salons = require("../seeds/data/salons/salons");


const ReportSchema = new mongoose.Schema({
    
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendors",
    },
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees",
    },
    name: {
        required: true,
        type: String,
    },
    title: {
        required: true,
        type: String,
    },
    description: {
        required: true,
        type: String,
    },
    photo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos"
    },


})
const ReportVendor = mongoose.model("report", ReportSchema)

export default ReportVendor