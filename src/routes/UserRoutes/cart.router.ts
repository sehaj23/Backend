import { Router } from "express";
import CartController from "../../controller/cart.controller";
import CartService from "../../service/cart.service";
import Cart from "../../models/cart.model";
import UserverifyToken from "../../middleware/User.jwt";

const cartRouter = Router()
const cartService = new CartService(Cart)
const cartController = new CartController(cartService)
cartRouter.post("/", UserverifyToken, cartController.post)
cartRouter.get("/",UserverifyToken, cartController.getLastCartByUserId)
cartRouter.patch("/add-option/:cartId", UserverifyToken, cartController.addOptionToCart)

export default cartRouter