
import mongoose from "../database";
import { CartSI } from "../interfaces/cart.interface";
import { CartRedis } from "../redis/index.redis";


const CartSchema = new mongoose.Schema({
    options: [
        {
            option_id: {
                type: String
            },
            quantity: {
                type: Number
            },
            service_name: {
                type: String
            },
            option_name: {
                type: String
            },
            category_name: {
                type: String
            },
            service_id:{
                type:String
            },
            service_type:{
                type: String,
               default:"ZattireService",
                enum: ["ZattireService", "Explore"]
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
    salon_name:{
        type:String,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    status: {
        type: String,
        default: 'In use',
        enum: ['In use', 'Booked', 'Abandoned']
    },
  
}, {
    timestamps: true
})
CartSchema.index({ user_id: 1 });
const emptyCartCache = (userId: string) => {
    CartRedis.remove(userId)
}
CartSchema.pre("save", function () {
    //@ts-ignore
    const { user_id } = this
    if (user_id) {
        const userIdToUse = user_id?._id ?? user_id
        emptyCartCache(userIdToUse)
    }
})

CartSchema.pre("remove", function () {
    //@ts-ignore
    const { user_id } = this
    if (user_id) {
        const userIdToUse = user_id?._id ?? user_id
        emptyCartCache(userIdToUse)
    }
})

CartSchema.pre("deleteOne", function () {
    //@ts-ignore
    const { user_id } = this
    if (user_id) {
        const userIdToUse = user_id?._id ?? user_id
        emptyCartCache(userIdToUse)
    }
})


const Cart = mongoose.model<CartSI>("carts", CartSchema)

export default Cart