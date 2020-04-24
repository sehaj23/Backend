/// <reference types="mongoose" />
import mongoose from "../database";
export default interface UserI {
    name: string;
    email: string;
    password?: string;
    signin_from?: string;
    photo?: string;
    age?: string;
    gender?: string;
    color_complextion?: string;
    approved?: boolean;
}
export interface UserSI extends UserI, mongoose.Document {
}
