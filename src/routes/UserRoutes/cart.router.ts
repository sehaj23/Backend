import { Router } from "express";
import CartController from "../../controller/cart.controller";
import CartService from "../../service/cart.service";
import Cart from "../../models/cart.model";

const cartRouter = Router()
const cartService = new CartService(Cart)
const cartController = new CartController(cartService)
cartRouter.post("/", cartController.post)
cartRouter.get("/", cartController.getLastCartByUserId)
cartRouter.patch("/add-option/:cartId", cartController.addOptionToCart)

export default cartRouter