import BaseController from "./base.controller"
import CartService from "../service/cart.service"
import { Request, Response } from "express"
import controllerErrorHandler from "../middleware/controller-error-handler.middleware"

export default class CartController extends BaseController{
    
    cartService: CartService
    constructor(cartService: CartService){
        super(cartService)
        this.cartService = cartService
    }
    /**
     * This is to add an option id to an exsisting cart
     */

    post =controllerErrorHandler( async (req: Request, res: Response) => {
        //@ts-ignore
        req.body.user_id = req.userId
        const data = await this.cartService.createCart(req.body)
        if(data==null){
            return res.send({message:"Unable to add data in cart",success:"false"})
        }
        res.send(data) 
    })

    addOptionToCart =controllerErrorHandler( async (req: Request, res: Response) => {
        const {cartId} = req.params
        const {option_id} = req.body
        const data = await this.cartService.addOptionToCart(cartId, option_id)
        res.send(data)
    })

    /**
     * Getting the latest cart by user id
     */
    getLastCartByUserId =controllerErrorHandler( async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        const data = await this.cartService.getCartByUserId(userId, true)
        res.send(data)
    } )

}