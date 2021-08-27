import mongoose from "../database";
import { CashBackRangeSI } from "../interfaces/cashbackRange.interface";


const CashbackRange = new mongoose.Schema({

 range_name:{
     type:String,
     unique: true,
     required: true
 },
 start_amount:{
    type: Number,
    required: true
 },
 end_amount:{
    type: Number,
    required: true
 },
 count:{
    type: Number,
    default: 0,
    required: true
}
})

const Cashbackrange = mongoose.model<CashBackRangeSI>("cashback-range", CashbackRange)

export default Cashbackrange