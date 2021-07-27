
import mongoose from "../database";
export enum promoUsedStatus {
    INUSE="In-use",
    COMPLETED = "Completed",
    DISCARDED = "Discarded"
}
export interface PromoUserI{
    promo_code_id: string
    user_id: string,
    status:promoUsedStatus
}

export interface PromoUserSI extends PromoUserI, mongoose.Document{}