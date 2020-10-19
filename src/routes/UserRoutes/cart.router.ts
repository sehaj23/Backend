import { Router } from "express";
import CartController from "../../controller/cart.controller";
import CartService from "../../service/cart.service";
import Cart from "../../models/cart.model";
import UserverifyToken from "../../middleware/User.jwt";
import Salon from "../../models/salon.model";

const cartRouter = Router()
const cartService = new CartService(Cart, Salon)
const cartController = new CartController(cartService)
cartRouter.post("/", UserverifyToken, cartController.post)
cartRouter.get("/",UserverifyToken, cartController.getLastCartByUserId)
cartRouter.patch("/add-option/:cartId", UserverifyToken, cartController.addOptionToCart)
cartRouter.patch("/update-option/:optionId", UserverifyToken, cartController.updateCartOption)
cartRouter.delete("/delete-option/:optionId", UserverifyToken, cartController.delteOptionFromCart)
cartRouter.delete("/delete-cart/:id", UserverifyToken, cartController.delete)
cartRouter.post("/multiple-options", UserverifyToken, cartController.createCartWithMultipleOptions)
export default cartRouter