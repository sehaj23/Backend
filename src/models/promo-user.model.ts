
import mongoose from "../database";
import { PromoUserSI } from "../interfaces/promo-user.inderface";


const PromoUserSchema = new mongoose.Schema({
    promo_code_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "promoCodes",
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
}, {
    timestamps: true
})
PromoUserSchema.index({promo_code_id: 1, user_id: 1})

const PromoUserCode = mongoose.model<PromoUserSI>("promoUsers", PromoUserSchema)

export default PromoUserCode