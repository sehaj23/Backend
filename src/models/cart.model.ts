
import mongoose from "../database";
import CartI, { CartSI } from "../interfaces/cart.interface";


const CartSchema = new mongoose.Schema({
    options:[
        {
            option_id: {
                type: String
            },
            quantity: {
                type: Number
            }
        }
    ],
    total: {
        type: Number,
        default: 0
    },
    salon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "salons",
        required: true
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