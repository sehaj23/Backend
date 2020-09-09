import mongoose from "../database";
import ReportAppSI from "../interfaces/report-app.interface";


const ReportAppSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    phone:{
        type: String,
    },
    reason:{
        type: String,
        required: true
    },
    photo: {
        type: String
    }
}, {
    timestamps: true
})

const ReportApp = mongoose.model<ReportAppSI>("report_app", ReportAppSchema)

export default ReportApp