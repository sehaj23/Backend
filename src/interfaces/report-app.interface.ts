import mongoose from "../database";

export interface ReportAppI{
    name: string
    email?: string
    phone?: string
    reason: string
    photo?: string
}

export default interface ReportAppSI extends ReportAppI, mongoose.Document{}