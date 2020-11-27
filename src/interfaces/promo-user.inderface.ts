
import mongoose from "../database";

export interface PromoUserI{
    promo_code_id: string
    user_id: string
}

export interface PromoUserSI extends PromoUserI, mongoose.Document{}