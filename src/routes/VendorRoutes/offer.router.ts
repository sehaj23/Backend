import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import OfferService from "../../service/offer.service"
import Offer from "../../models/offer.model";
import OfferController from "../../controller/offer.controller";
const offerRouter = Router()

const offerService = new OfferService(Offer)
const offerController = new OfferController(offerService)


//offerRouter.post("/:id/service/:sid",VendorverifyToken,es.post)
offerRouter.put("/edit/:id",VendorverifyToken,offerController.updateOffer)
offerRouter.get("/",VendorverifyToken,offerController.allOffer)
offerRouter.patch("/disable/:id",VendorverifyToken,offerController.disableOffer)



export default offerRouter
