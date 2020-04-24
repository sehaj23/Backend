/// <reference types="mongoose" />
import mongoose from "../database";
export interface PhotoI {
    name: string;
    url: string;
    tags: string[];
    description: string;
    approved?: boolean;
}
export default interface PhotoSI extends PhotoI, mongoose.Document {
}
