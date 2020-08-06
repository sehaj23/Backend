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

    createCart =controllerErrorHandler( async (req: Request, res: Response) => {
        const {option_ids,salon_id,total} = req.body
      
        
        var d = {}
        //@ts-ignore
        d.salon_id = salon_id
        //@ts-ignore
        d.user_id = req.userId
        //@ts-ignore
        console.log(req.userId)
        //@ts-ignore
        d.option_ids= [option_ids]
        //@ts-ignore
        d.total = total
        const data = await this.cartService.createCart(d)
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