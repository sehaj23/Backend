import BaseService from "./base.service";
import mongoose from "../database";
import { CartSI } from "../interfaces/cart.interface";

export default class CartService extends BaseService{

    cartService: mongoose.Model<any, any>
    constructor(cartService: mongoose.Model<any, any>){
        super(cartService)
    }


    /**
     * This is to add an option id to an exsisting cart
     */
    addOptionToCart = async (cartId: string, option_id: string) => {
        const cart = await this.getId(cartId) as CartSI
        const {options} = cart
        let optionFound = false
        for(let i = 0; i < options.length; i++){
            const option = options[i]
            if(option.option_id === option_id){
                option.quantity += 1
                optionFound = true
                break
            }
        }
        if(optionFound === false){
            cart.options.push({
                option_id,
                quantity: 1
            })
        }
        return  await cart.save()
    }

    /**
     * Getting the cart by user id
     */
    getCartByUserId = async (userId: string, last: boolean = false) =>{
        if(!last) return this.model.find({"user_id": userId})
        return this.model.find({user_id: userId}).sort({"created_at": 1}).limit(1)
    } 

    createCart= async (d:any) =>{
        return this.model.create(d)
    

    }

}