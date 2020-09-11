import mongoose from "../database";

export interface MongoCounterI{
    name: string
    count: number
}

export default interface MongoCounterSI extends MongoCounterI, mongoose.Document{}