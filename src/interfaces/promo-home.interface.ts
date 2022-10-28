import mongoose from "../database";

export interface PromoHomeI{
    name: string,
    description: string,
    active: boolean,
    promo_code_id: string
    priority: number,
    image_url: string
}

export interface PromoHomeSI extends PromoHomeI, mongoose.Document{}