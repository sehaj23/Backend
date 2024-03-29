import { Request, Response } from "express"
import controllerErrorHandler from "../middleware/controller-error-handler.middleware"
import { CartRedis } from "../redis/index.redis"
import cartRouter from "../routes/UserRoutes/cart.router"
import CartService from "../service/cart.service"
import BaseController from "./base.controller"

export default class CartController extends BaseController{
    
    cartService: CartService
    constructor(cartService: CartService){
        super(cartService)
        this.cartService = cartService
    }
    /**
     * This is to add an option id to an exsisting cart
     */

    post = controllerErrorHandler( async (req: Request, res: Response) => {
        //@ts-ignore
        const data = await this.cartService.createCart(req.userId, req.body.salon_id, req.body.option_id)
        if(data==null){
            return res.send({message:"Unable to add data in cart",success:"false"})
        }
        res.send(data) 
    })

    createCartWithMultipleOptions = controllerErrorHandler( async (req: Request, res: Response) => {
        //@ts-ignore
        const data = await this.cartService.createCartWithMultipleOptions(req.userId, req.body.salon_id, req.body.options)
        res.send(data)
    })

    addOptionToCart =controllerErrorHandler( async (req: Request, res: Response) => {
        const {cartId} = req.params
        const {option_id} = req.body
        const data = await this.cartService.addOptionToCart(cartId, option_id)
        res.send(data)
    })

    updateCartOption = controllerErrorHandler( async (req: Request, res: Response) => {
        const {cartId, optionId} = req.params
        //@ts-ignore
        const userId = req.userId
        const quantity = req.body.quantity as number
        const data = await this.cartService.updateCartOption(userId, optionId, quantity)
        res.send(data)
    })
    delteOptionFromCart = controllerErrorHandler( async (req: Request, res: Response) => {
        const {optionId} = req.params
        //@ts-ignore
        const userId = req.userId
        const data = await this.cartService.deleteOptionFromCart(userId, optionId)
        res.send(data)
    })

    /**
     * Getting the latest cart by user id
     */
    getLastCartByUserId =controllerErrorHandler( async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        const data = await this.cartService.getCartByUserIdLean(userId, true)
        res.send(data)
    } )
    deleteCart = async (req: Request, res: Response) => {
        const {id} = req.params
        try {
            // saving photos 
            //@ts-ignore
           await CartRedis.remove(req.userId)
            const newEvent = await this.service.delete(id)
            res.send(newEvent)
        } catch (e) {
            
            res.status(403).send(`${e.message}` )
        }
    }

}