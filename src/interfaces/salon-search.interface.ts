import mongoose from "../database";


// this is the interface to give auto suggestion to users when they search
export default interface SalonSearchI{
    category?: string
    service_name: string // this is the term user is searching
    filters?: Object // filters by user
    result?: Object // result sent back
}

export interface SalonSearchSI extends SalonSearchI, mongoose.Document{}