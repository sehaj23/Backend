/// <reference types="mongoose" />
import mongoose from "../database";
export default interface EventI {
    name: string;
    start_date_time: Date | string;
    end_date_time: Date | string;
    location: string;
    entry_procedure: string;
    exhibition_house: string;
    description: string;
    approved?: boolean;
    photo_ids?: number[];
}
export interface EventSI extends EventI, mongoose.Document {
}
