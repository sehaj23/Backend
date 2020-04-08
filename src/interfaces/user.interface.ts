import mongoose from "../database";


export default interface UserI{
    email: string
    password?: string
}

export interface UserSI extends UserI, mongoose.Document{}