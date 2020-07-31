import { Router } from "express"
import OfferService from "../../service/offer.service"
import verifyToken from "../../middleware/jwt"
import Offer from "../../models/offer.model"
import OfferController from "../../controller/offer.controller"

const offerRouter = Router()

const offerService = new OfferService(Offer)
const offerController = new OfferController(offerService)

offerRouter.post("/", verifyToken, offerController.post)
offerRouter.get("/", verifyToken, offerController.get)
offerRouter.get("/:id", verifyToken, offerController.getId)
offerRouter.put("/:id", verifyToken, offerController.put)

export default offerRouter