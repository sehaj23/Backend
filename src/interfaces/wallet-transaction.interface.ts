import mongoose from "../database";


export interface WalletTransactionI {
    transaction_type: string
    user_id: string
    transaction_owner: string
    amount: number
    reference_model: string
    reference_id: string
    comment: string
}
export interface WalletTransactionSI extends WalletTransactionI, mongoose.Document { }
