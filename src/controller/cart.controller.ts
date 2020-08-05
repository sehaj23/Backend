import BaseController from "./base.controller"
import CartService from "../service/cart.service"
import { Request, Response } from "express"

export default class CartController extends BaseController{
    
    cartService: CartService
    constructor(cartService: CartService){
        super(cartService)
        this.cartService = cartService
    }
    /**
     * This is to add an option id to an exsisting cart
     */
    addOptionToCart = async (req: Request, res: Response) => {
        const {cartId} = req.params
        const {option_id} = req.body
        const data = await this.cartService.addOptionToCart(cartId, option_id)
        res.send(data)
    }

    /**
     * Getting the latest cart by user id
     */
    getLastCartByUserId = async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req._id
        const data = await this.cartService.getCartByUserId(userId, true)
        res.send(data)
    } 

}