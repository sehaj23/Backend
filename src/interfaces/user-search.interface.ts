import mongoose from "../database";


export default interface UserSearchI{
    user_id?: string
    term: string // this is the term user is searching
    filters?: Object // filters by user
    result?: Object // result sent back
}

export interface UserSearchSI extends UserSearchI, mongoose.Document{}