import mongoose from "../database";

export interface CashBackRangeI {
    range_name:string,
    start_amount:number,
    end_amount:number,
    count:number
}

export interface CashBackRangeSI extends CashBackRangeI, mongoose.Document { }