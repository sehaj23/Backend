import mongoose from "../database";


const WalletTransactionSchema = new mongoose.Schema({
    transaction_type: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    transaction_owner: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reference_model: {
        type: String
    },
    reference_id: {
        type: String
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})
const WalletTransaction = mongoose.model("wallet_transactions", WalletTransactionSchema)

export default WalletTransaction