import mongoose from "../database";
import MongoCounterSI from "../interfaces/mongo-counter.interface";


const MongoCounterSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true,
        required: true
    },
    count:{
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
})

const MongoCounter = mongoose.model<MongoCounterSI>("mongoCounters", MongoCounterSchema)

export default MongoCounter