import mongoose from "../database";
import salons = require("../seeds/data/salons/salons");


const ReportSalonSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    salon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "salons",
    },
    error: {
        type: [String],
    },
    info: {
        required: true,
        type: String,
    },



}, {
    timestamps: true
})
const ReportSalon = mongoose.model("report-salon", ReportSalonSchema)

export default ReportSalon