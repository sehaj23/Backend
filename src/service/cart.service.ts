import BaseService from "./base.service";
import mongoose from "../database";

export default class CartService extends BaseService{

    cartService: mongoose.Model<any, any>
    constructor(cartService: mongoose.Model<any, any>){
        super(cartService)
    }


    /**
     * This is to add an option id to an exsisting cart
     */
    addOptionToCart = async (cartId: string, option_id: string) => {
        return this.model.update({"_id": cartId}, {"option_ids": {"$push": option_id}})
    }

    /**
     * Getting the cart by user id
     */
    getCartByUserId = async (userId: string, last: boolean = false) =>{
        if(!last) return this.model.find({"user_id": userId})
        return this.model.find({user_id: userId}).sort({"created_at": 1}).limit(1)
    } 

}