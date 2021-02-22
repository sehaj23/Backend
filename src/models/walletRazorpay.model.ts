import mongoose from "../database";


const WalletRazorpaySchema = new mongoose.Schema({
    razorpay_order_id: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["INITIATED", "SUCCESSFUL", "UNSUCCESSFUL"]
    },
    razorpay_payment_data: Object,
    error_message: String
})
const WalletRazorpay = mongoose.model("wallet_razorpay", WalletRazorpaySchema)

export default WalletRazorpay