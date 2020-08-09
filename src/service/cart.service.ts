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
     * This is the function to delete the option from the cart
     */
     
    deleteOptionFromCart = async (userId, optionId: string) => {
        const cart = await this.model.findOne({"options.option_id": optionId, "user_id": userId}) as CartSI
        if(cart === null) throw new Error("Cart not found")
        const {options} = cart
        for(let i = 0; i < options.length; i++){
            const option = options[i]
            if(option.option_id === optionId){
                cart.options.splice(i, 1)
                await cart.save()
                return cart
            }
        }
        throw new Error("Error while deleteing the id. Check cart id and option id")
    }

    /**
     * This is the function to delete the option from the cart
     */
     
    updateCartOption = async (userId, optionId: string, qty: number) => {
        const cart = await this.model.update({"options.option_id": optionId, "user_id": userId}, {$set: {"options.$.quantity": qty}}) as CartSI
        if(cart === null) throw new Error("Cart not found")
        const {options} = cart
        for(let i = 0; i < options.length; i++){
            const option = options[i]
            if(option.option_id === optionId){
                cart.options.splice(i, 1)
                await cart.save()
                return cart
            }
        }
        throw new Error("Error while deleteing the id. Check cart id and option id")
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