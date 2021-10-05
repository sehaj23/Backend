import mongoose from "../database";
import { CashBackSI } from "../interfaces/cashback.interface";
import { CashBackRangeSI } from "../interfaces/cashbackRange.interface";


const Cashback = new mongoose.Schema({

amount:{
    type:Number,
    required: true
},
user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
},
opened:{
    type:Boolean,
    default:false
},
wallet_transaction:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'wallet_transactions',
  
},
booking_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking',
}
})

const Cashbackuser = mongoose.model<CashBackSI>("cashback", Cashback)

export default Cashbackuser