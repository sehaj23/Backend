
import mongoose from "../database";
import CartI, { CartSI } from "../interfaces/cart.interface";


const CartSchema = new mongoose.Schema({
    option_ids:[{
        type: String
    }],
    total: {
        type: Number,
        default: 0
    },
    salon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "salons"
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, {
    timestamps: true
})


const Cart = mongoose.model<CartSI>("carts", CartSchema)

export default Cart