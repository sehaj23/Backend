import mongoose from "../database";

export interface CashBackI {
   amount:number,
   user_id:string,
   opened:boolean,
   booking_id:string,
   wallet_transaction?:string
}

export interface CashBackSI extends CashBackI, mongoose.Document { }