import BaseService from "./base.service";
import mongoose from "../database";
import CartI, { CartSI } from "../interfaces/cart.interface";
import SalonSI from "../interfaces/salon.interface";

export default class CartService extends BaseService {

    salonModel: mongoose.Model<any, any>
    constructor(cartModel: mongoose.Model<any, any>, salonModel: mongoose.Model<any, any>) {
        super(cartModel)
        this.salonModel = salonModel
    }

    getPriceByOptionId: (optionId: string) => Promise<number> = async (optionId: string) => {
        const salon = await this.salonModel.findOne({ "services.options._id": mongoose.Types.ObjectId(optionId) }) as SalonSI
        if (salon === null || !salon) throw new Error("Salon not found")
        for (let service of salon.services) {
            for (let option of service.options) {
                if (option._id.toString() === optionId) return option.price.valueOf()
            }
        }
        throw new Error("Option not found")
    }

    getPriceAndNameByOptionId: (optionId: string) => Promise<{name: string, price: number}> = async (optionId: string) => {
        const salon = await this.salonModel.findOne({ "services.options._id": mongoose.Types.ObjectId(optionId) }) as SalonSI
        if (salon === null || !salon) throw new Error("Salon not found")
        for (let service of salon.services) {
            for (let option of service.options) {
                if (option._id.toString() === optionId) return {
                    name: option.option_name.valueOf(),
                    price: option.price.valueOf()
                }
            }
        }
        throw new Error("Option not found")
    }

    /**
     * This is to add an option id to an exsisting cart
     */
    addOptionToCart = async (cartId: string, option_id: string) => {

        const cart = await this.getId(cartId) as CartSI
        const { options } = cart
        // const exist = await this.model.findOne({"options.option_id": option_id, "user_id": userId}
        let optionFound = false
        for (let i = 0; i < options.length; i++) {
            const option = options[i]
            if (option.option_id === option_id) {
                option.quantity += 1
                optionFound = true
                break
            }
        }
        if (optionFound === false) {
            cart.options.push({
                option_id,
                quantity: 1
            })
        }
        // getting the price of the by option id
        const optionPrice = await this.getPriceByOptionId(option_id)
        const newPrice = cart.total + optionPrice
        cart.total = newPrice
        return await cart.save()
    }

    /**
     * This is the function to delete the option from the cart
     */

    deleteOptionFromCart = async (userId, optionId: string) => {
        const cart = await this.model.findOne({ "options.option_id": optionId, "user_id": userId }) as CartSI
        if (cart === null) throw new Error("Cart not found")
        const { options } = cart
        for (let i = 0; i < options.length; i++) {
            const option = options[i]
            if (option.option_id === optionId) {
                const optionPrice = await this.getPriceByOptionId(optionId)
                const amntToMinus = optionPrice * option.quantity
                cart.total -= amntToMinus
                cart.options.splice(i, 1)
                if(cart.options.length === 0){ 
                    await cart.remove()
                    return null
                }
                else await cart.save()
                return cart
            }
        }
        throw new Error("Error while deleteing the id. Check cart id and option id")
    }

    /**
     * This is the function to delete the option from the cart
     */

    updateCartOption = async (userId, optionId: string, qty: number) => {
        if (qty === 0) return this.deleteOptionFromCart(userId, optionId)
        const cart = await this.model.findOne({ "options.option_id": optionId, "user_id": userId }) as CartSI
        if (cart === null) throw new Error("Cart not found")
        for (let option of cart.options) {
            if (option.option_id === optionId) {
                const optionPrice = await this.getPriceByOptionId(optionId)

                if (option.quantity < qty) {
                    cart.total += optionPrice
                } else if (option.quantity > qty) {
                    cart.total -= optionPrice
                }
                option.quantity = qty
                break
            }
        }
        await cart.save()
        return cart
    }

    /**
     * Getting the cart by user id
     */
    getCartByUserId = async (userId: string, last: boolean = false) => {

        // if(!last){ 
        //  const cart = await this.model.find({"user_id": userId}) as CartSI
        //  }
        const cart = await this.model.find({ user_id: userId }).sort({ "createdAt": -1 }).limit(1) as CartSI
        for(let c of cart.options){
            const {name, price} = await this.getPriceAndNameByOptionId(c.option_id)
            //@ts-ignore
            c.option_name = name
            //@ts-ignore
            c.price = price
        }
        return cart
    }

    createCart = async (userId: string, salonId: string, optionId: string) => {
        
        const optionPrice = await this.getPriceByOptionId(optionId)

        const cart: CartI = {
            user_id: userId,
            salon_id: salonId,
            options: [{option_id: optionId, quantity: 1}],
            total: optionPrice
        }

        return this.model.create(cart)
    }

}